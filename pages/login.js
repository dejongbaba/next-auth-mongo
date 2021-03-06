import React, { useState } from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import withAuth from '../components/withAuth'
import { authLogin } from '../lib/authHelpers'

function Login({ issue, register }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const disabled = email === '' || password === ''

  async function handleSubmit(e) {
    e.preventDefault()
    const url = 'http://localhost:3000/api/user/login'
    try {
      const loginAttempt = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (loginAttempt.ok) {
        const { token } = await loginAttempt.json()
        authLogin(token)
      } else {
        const { errors } = await loginAttempt.json()
        setValidationErrors(errors)
      }
    } catch (err) {
      setValidationErrors([
        ...validationErrors,
        'An unknown error occured, please try again.'
      ])
      console.error('Error:', err)
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <h1 className="title">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <div className="control">
            <input
              type="email"
              className="input"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              type="password"
              className="input"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        {validationErrors.length > 0 ? (
          <div className="message is-danger">
            <div className="message-body">
              {validationErrors.map(error => {
                return <p>{error}</p>
              })}
            </div>
          </div>
        ) : null}
        {issue && issue === 'banned' ? (
          <div className="message is-danger">
            <div className="message-body">
              <p>Login failure. You have been banned.</p>
            </div>
          </div>
        ) : null}
        {register && register === 'success' ? (
          <div className="message is-success">
            <div className="message-body">
              <p>
                Your account was created. A message was sent to your provided
                email address. Please check it and click the link for
                verification.
              </p>
            </div>
          </div>
        ) : null}
        <div className="field">
          <div className="control">
            <button disabled={disabled} type="submit" className="button">
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

Login.getInitialProps = ({ query }) => {
  const { issue, register } = query
  return { issue, register }
}

export default withAuth(Login, true)
