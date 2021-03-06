import React, { Component } from 'react'
import Layout from './layout/Layout'
import { authRouteCheck, verifyRedirect, getUser } from '../lib/authHelpers'

function withAuthRouteCheck(C) {
  return class extends Component {
    constructor(props) {
      super(props)
    }
    static async getInitialProps(ctx) {
      const token = authRouteCheck(ctx)
      const user = await getUser(token)
      if (!user.isVerified) {
        verifyRedirect(ctx)
      }
      const cProps = C.getInitialProps && (await C.getInitialProps(ctx, user))
      return { ...cProps, user }
    }

    componentDidMount() {
      window.addEventListener('storage', e => authLogoutSync(e))
    }

    render() {
      const { user } = this.props
      return (
        <Layout user={user}>
          <C {...this.props} />
        </Layout>
      )
    }
  }
}

export default withAuthRouteCheck
