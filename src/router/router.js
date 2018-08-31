import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Meetups from '../views/Meetup/Meetups'
import CreateMeetup from '../views/Meetup/CreateMeetup'
import Meetup from '../views/Meetup/Meetup'
import Profile from '../views/User/Profile'
import Login from '../views/User/Login'
import Signup from '../views/User/Signup'
import AuthGuard from './auth-guard'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/meetups',
      name: 'Meetups',
      component: Meetups
    },
    {
      path: '/meetup/new',
      name: 'CreateMeetup',
      component: CreateMeetup,
      beforeEnter: AuthGuard
    },
    {
      path: '/meetups/:id',
      name: 'Meetup',
      component: Meetup,
      props: true
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
})
