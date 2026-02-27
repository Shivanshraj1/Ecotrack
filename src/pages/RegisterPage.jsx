const RegisterPage = () => (
  <div className="grid min-h-screen place-content-center bg-slate-50 p-6 dark:bg-slate-950">
    <form className="card w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="input" type="text" placeholder="Name" />
      <input className="input" type="email" placeholder="Email" />
      <input className="input" type="password" placeholder="Password" />
      <input className="input" type="password" placeholder="Confirm Password" />
      <button type="button" className="btn-primary w-full">Register</button>
    </form>
  </div>
)

export default RegisterPage
