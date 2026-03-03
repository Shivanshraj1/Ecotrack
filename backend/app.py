from dotenv import load_dotenv
import json
import os
import random
import sqlite3
import razorpay
import hmac
import hashlib
import smtplib
from datetime import datetime, timezone, timedelta
from email.message import EmailMessage

from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = os.path.dirname(__file__)
DOTENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=DOTENV_PATH)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(BASE_DIR, "ecotrack.db")
AUTH_SALT = os.getenv("AUTH_SALT", "ecotrack-auth-salt")
OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "10"))
LOGIN_CAPTCHA_MAX_FAILS = int(os.getenv("LOGIN_CAPTCHA_MAX_FAILS", "3"))
login_attempts = {}


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "household"
    company: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str
    captcha_passed: bool = True
    require_otp: bool = False
    otp_code: str = ""


class SaveUserRequest(BaseModel):
    id: int
    email: str
    data: dict


class OtpSendRequest(BaseModel):
    email: str
    purpose: str = "signup"


class OtpVerifyRequest(BaseModel):
    email: str
    purpose: str = "signup"
    otp_code: str


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_email(email: str) -> str:
    return (email or "").strip().lower()


def hash_password(password: str) -> str:
    return hashlib.sha256(f"{AUTH_SALT}{password}".encode("utf-8")).hexdigest()


def hash_otp(email: str, purpose: str, otp_code: str) -> str:
    seed = f"{AUTH_SALT}|{normalize_email(email)}|{purpose}|{otp_code}"
    return hashlib.sha256(seed.encode("utf-8")).hexdigest()


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def parse_iso(ts: str) -> datetime:
    return datetime.fromisoformat(ts)


def create_default_business_data() -> dict:
    return {
        "team": [],
        "compliance": [],
        "reports": [],
        "paymentRequests": [],
    }


def create_user_payload(user_id: int, name: str, email: str, role: str, company: str, created_at: str) -> dict:
    return {
        "id": user_id,
        "name": name,
        "email": email,
        "role": role,
        "company": company or "",
        "ecoPoints": 0,
        "totalWaste": 0,
        "co2Saved": 0,
        "virtualTrees": 0,
        "plan": "freemium",
        "planSince": created_at,
        "planPayments": [],
        "redeemedRewards": [],
        "rewardDeliveries": [],
        "pickupRequests": [],
        "businessData": create_default_business_data(),
        "lastLoginAt": created_at,
        "createdAt": created_at,
    }


def init_db() -> None:
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                company TEXT,
                data_json TEXT,
                created_at TEXT NOT NULL,
                last_login_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS otp_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                purpose TEXT NOT NULL,
                otp_hash TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                used_at TEXT,
                attempts INTEGER NOT NULL DEFAULT 0
            )
            """
        )
        conn.commit()


def send_otp_email(to_email: str, otp_code: str, purpose: str) -> None:
    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USERNAME", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    smtp_from = os.getenv("SMTP_FROM", smtp_user).strip()

    # Gmail quick setup support
    if (not smtp_user or not smtp_password) and os.getenv("EMAIL_USER") and os.getenv("EMAIL_PASS"):
        smtp_host = "smtp.gmail.com"
        smtp_port = 587
        smtp_user = os.getenv("EMAIL_USER", "").strip()
        smtp_password = os.getenv("EMAIL_PASS", "").strip()
        smtp_from = smtp_user

    if not smtp_host or not smtp_user or not smtp_password or not smtp_from:
        raise HTTPException(
            status_code=500,
            detail="OTP email is not configured. Set EMAIL_USER/EMAIL_PASS (Gmail app password) or SMTP_HOST/SMTP_USERNAME/SMTP_PASSWORD/SMTP_FROM.",
        )

    purpose_label = "Sign Up" if purpose == "signup" else "Login Security"
    msg = EmailMessage()
    msg["Subject"] = f"EcoTrack OTP - {purpose_label}"
    msg["From"] = smtp_from
    msg["To"] = to_email
    msg.set_content(
        f"Your EcoTrack OTP is: {otp_code}\n\n"
        f"This OTP is valid for {OTP_TTL_MINUTES} minutes.\n"
        f"If you did not request this, please ignore this email."
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
        try:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        except smtplib.SMTPAuthenticationError as exc:
            raise HTTPException(
                status_code=500,
                detail="Email authentication failed. Check EMAIL_USER and Gmail App Password (EMAIL_PASS).",
            ) from exc
        except smtplib.SMTPException as exc:
            raise HTTPException(
                status_code=500,
                detail=f"SMTP send failed: {str(exc)}",
            ) from exc


def create_and_store_otp(conn: sqlite3.Connection, email: str, purpose: str) -> str:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=OTP_TTL_MINUTES)
    otp_code = f"{random.SystemRandom().randint(0, 999999):06d}"
    otp_hash = hash_otp(email, purpose, otp_code)

    conn.execute(
        """
        UPDATE otp_codes
        SET used_at = ?
        WHERE email = ? AND purpose = ? AND used_at IS NULL
        """,
        (now.isoformat(), email, purpose),
    )
    conn.execute(
        """
        INSERT INTO otp_codes (email, purpose, otp_hash, created_at, expires_at, used_at, attempts)
        VALUES (?, ?, ?, ?, ?, NULL, 0)
        """,
        (email, purpose, otp_hash, now.isoformat(), expires_at.isoformat()),
    )
    conn.commit()
    return otp_code


def verify_stored_otp(conn: sqlite3.Connection, email: str, purpose: str, otp_code: str, consume: bool) -> None:
    row = conn.execute(
        """
        SELECT * FROM otp_codes
        WHERE email = ? AND purpose = ? AND used_at IS NULL
        ORDER BY id DESC
        LIMIT 1
        """,
        (email, purpose),
    ).fetchone()

    if not row:
        raise HTTPException(status_code=400, detail="OTP not found. Please request a new OTP.")

    now = datetime.now(timezone.utc)
    expires_at = parse_iso(row["expires_at"])
    if now > expires_at:
        conn.execute("UPDATE otp_codes SET used_at = ? WHERE id = ?", (now.isoformat(), row["id"]))
        conn.commit()
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new OTP.")

    expected_hash = hash_otp(email, purpose, otp_code)
    if row["otp_hash"] != expected_hash:
        attempts = int(row["attempts"] or 0) + 1
        used_at = now.isoformat() if attempts >= 5 else None
        conn.execute(
            "UPDATE otp_codes SET attempts = ?, used_at = COALESCE(?, used_at) WHERE id = ?",
            (attempts, used_at, row["id"]),
        )
        conn.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    if consume:
        conn.execute("UPDATE otp_codes SET used_at = ? WHERE id = ?", (now.isoformat(), row["id"]))
        conn.commit()


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    email_user = os.getenv("EMAIL_USER", "").strip()
    email_pass = os.getenv("EMAIL_PASS", "").strip()
    smtp_user = os.getenv("SMTP_USERNAME", "").strip()
    smtp_pass = os.getenv("SMTP_PASSWORD", "").strip()
    has_gmail = bool(email_user and email_pass)
    has_smtp = bool(smtp_user and smtp_pass)
    print(f"EcoTrack startup: .env loaded from {DOTENV_PATH}")
    print(f"EcoTrack startup: EMAIL config ready={has_gmail}, SMTP config ready={has_smtp}")


# Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET"))
)


@app.get("/")
def home():
    return {"message": "EcoTrack Backend Running"}


@app.post("/auth/send-otp")
def auth_send_otp(payload: OtpSendRequest):
    email = normalize_email(payload.email)
    purpose = (payload.purpose or "signup").strip().lower()
    if purpose not in {"signup", "login"}:
        raise HTTPException(status_code=400, detail="Invalid OTP purpose.")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")

    with get_conn() as conn:
        if purpose == "signup":
            existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
            if existing:
                raise HTTPException(status_code=409, detail="This email is already registered. Please login.")

        otp_code = create_and_store_otp(conn, email, purpose)

    send_otp_email(email, otp_code, purpose)
    return {"success": True, "message": "OTP sent successfully."}


@app.post("/send-otp")
async def send_otp_compat(request: Request):
    try:
        body = await request.json()
        email = normalize_email(body.get("email"))
        purpose = (body.get("purpose") or "signup").strip().lower()

        if not email:
            return {"error": "Email required"}

        print("Sending OTP to:", email)
        print("EMAIL_USER:", os.getenv("EMAIL_USER"))

        if purpose not in {"signup", "login"}:
            return {"error": "Invalid OTP purpose"}

        with get_conn() as conn:
            if purpose == "signup":
                existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
                if existing:
                    return JSONResponse(status_code=409, content={"error": "This email is already registered. Please login."})

            otp_code = create_and_store_otp(conn, email, purpose)

        send_otp_email(email, otp_code, purpose)
        print("OTP SENT:", otp_code)
        return {"message": "OTP sent", "success": True}

    except HTTPException as exc:
        print("OTP ERROR:", str(exc.detail))
        return JSONResponse(status_code=exc.status_code, content={"error": str(exc.detail)})
    except Exception as exc:
        print("OTP ERROR:", str(exc))
        return JSONResponse(status_code=500, content={"error": str(exc)})


@app.post("/auth/verify-otp")
def auth_verify_otp(payload: OtpVerifyRequest):
    email = normalize_email(payload.email)
    purpose = (payload.purpose or "signup").strip().lower()
    otp_code = (payload.otp_code or "").strip()

    if purpose not in {"signup", "login"}:
        raise HTTPException(status_code=400, detail="Invalid OTP purpose.")
    if len(otp_code) != 6 or not otp_code.isdigit():
        raise HTTPException(status_code=400, detail="Enter a valid 6-digit OTP.")

    with get_conn() as conn:
        verify_stored_otp(conn, email, purpose, otp_code, consume=False)

    return {"success": True, "message": "OTP verified."}


@app.post("/verify-otp")
async def verify_otp_compat(request: Request):
    body = await request.json()
    email = normalize_email(body.get("email"))
    purpose = (body.get("purpose") or "signup").strip().lower()
    otp_code = (body.get("otp") or body.get("otp_code") or "").strip()
    return auth_verify_otp(OtpVerifyRequest(email=email, purpose=purpose, otp_code=otp_code))


@app.post("/auth/signup")
def auth_signup(payload: SignupRequest):
    email = normalize_email(payload.email)
    name = (payload.name or "").strip()
    password = payload.password or ""
    role = (payload.role or "household").strip().lower()
    company = (payload.company or "").strip()

    if not name:
        raise HTTPException(status_code=400, detail="Name is required.")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    if role not in {"household", "business"}:
        role = "household"

    created_at = utc_now_iso()
    password_hash = hash_password(password)

    with get_conn() as conn:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            raise HTTPException(status_code=409, detail="This email is already registered. Please login.")

        cursor = conn.execute(
            """
            INSERT INTO users (name, email, password_hash, role, company, data_json, created_at, last_login_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (name, email, password_hash, role, company, "{}", created_at, created_at),
        )
        user_id = int(cursor.lastrowid)
        user_data = create_user_payload(user_id, name, email, role, company, created_at)

        conn.execute(
            "UPDATE users SET data_json = ? WHERE id = ?",
            (json.dumps(user_data), user_id),
        )
        conn.commit()

    return {"success": True, "user": user_data}


@app.post("/auth/login")
def auth_login(payload: LoginRequest):
    email = normalize_email(payload.email)
    password = payload.password or ""
    password_hash = hash_password(password)
    captcha_passed = bool(payload.captcha_passed)
    require_otp = bool(payload.require_otp)
    otp_code = (payload.otp_code or "").strip()

    if not captcha_passed:
        count = int(login_attempts.get(email, 0)) + 1
        login_attempts[email] = count
        return {
            "success": False,
            "require_otp": count >= LOGIN_CAPTCHA_MAX_FAILS,
            "attempts": count,
            "message": "Captcha not passed."
        }

    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if not row or row["password_hash"] != password_hash:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        if require_otp:
            if len(otp_code) != 6 or not otp_code.isdigit():
                raise HTTPException(status_code=400, detail="OTP is required for secure login.")
            verify_stored_otp(conn, email, "login", otp_code, consume=True)

        now_iso = utc_now_iso()
        data_json = row["data_json"] or "{}"
        try:
            user_data = json.loads(data_json)
        except Exception:
            user_data = create_user_payload(
                int(row["id"]),
                row["name"],
                row["email"],
                row["role"],
                row["company"] or "",
                row["created_at"],
            )

        user_data["lastLoginAt"] = now_iso

        conn.execute(
            "UPDATE users SET data_json = ?, last_login_at = ? WHERE id = ?",
            (json.dumps(user_data), now_iso, int(row["id"])),
        )
        conn.commit()

    login_attempts[email] = 0
    return {"success": True, "user": user_data}


@app.post("/login")
async def login_compat(request: Request):
    body = await request.json()
    payload = LoginRequest(
        email=body.get("email", ""),
        password=body.get("password", ""),
        captcha_passed=bool(body.get("captcha_passed", True)),
        require_otp=bool(body.get("require_otp", False)),
        otp_code=(body.get("otp") or body.get("otp_code") or "")
    )
    return auth_login(payload)


@app.post("/auth/save-user")
def auth_save_user(payload: SaveUserRequest):
    email = normalize_email(payload.email)
    user_data = payload.data or {}

    with get_conn() as conn:
        row = conn.execute(
            "SELECT id FROM users WHERE id = ? AND email = ?",
            (payload.id, email),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found.")

        safe_data = dict(user_data)
        safe_data.pop("password", None)

        conn.execute(
            "UPDATE users SET data_json = ?, name = ?, role = ?, company = ? WHERE id = ?",
            (
                json.dumps(safe_data),
                safe_data.get("name", ""),
                safe_data.get("role", "household"),
                safe_data.get("company", ""),
                payload.id,
            ),
        )
        conn.commit()

    return {"success": True}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    label = random.choice(["Biodegradable", "Non-Biodegradable"])

    if label == "Biodegradable":
        details = {
            "recommended_bin": "Green",
            "eco_points": 10,
            "description": "Organic waste suitable for composting."
        }
    else:
        details = {
            "recommended_bin": "Blue",
            "eco_points": 5,
            "description": "Plastic or metal waste."
        }

    return {
        "label": label,
        "confidence": 92.5,
        "details": details
    }


@app.post("/create-order")
async def create_order(request: Request):
    body = await request.json()
    amount = body.get("amount")

    order = razorpay_client.order.create({
        "amount": amount * 100,
        "currency": "INR",
        "receipt": f"receipt_{amount}"
    })

    return order


@app.post("/verify-payment")
async def verify_payment(request: Request):
    body = await request.json()

    razorpay_order_id = body.get("razorpay_order_id")
    razorpay_payment_id = body.get("razorpay_payment_id")
    razorpay_signature = body.get("razorpay_signature")

    generated_signature = hmac.new(
        os.getenv("RAZORPAY_KEY_SECRET").encode(),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()

    return {"success": generated_signature == razorpay_signature}
