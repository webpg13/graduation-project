import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeIndex from '../views/index/HomeIndex.vue'
import UserLogin from '../views/admin/UserLogin'
import UserRegister from '../views/admin/UserRegister'
import UserHome from '../views/User/UserHome'
import MenuTest from '../views/UserMenu/MenuTest'
import BasicInformation from '../views/UserMenu/BasicInformation'
import VaccingRecord from '../views/UserMenu/VaccingRecord'
import AllergyRegister from '../views/UserMenu/AllergyRegister'
import VaccineShop from '../views/UserMenu/VaccineShop'
import VaccineItem from '../views/UserMenu/VaccineItem/VaccineItem'
import VaccineInstitution from '../views/UserMenu/VaccineItem/VaccineInstitution'
import VaccineAttentionList from '../views/UserMenu/VaccineAttentionList'
import LackRegister from '../views/UserMenu/LackRegister'
import MyBooking from '../views/UserMenu/MyBooking'
import AdminLogin from '../views/admin/AdminLogin'
import AdminHome from '../views/User/AdminHome'
import AdminIntroduce from '../views/AdminMenu/AdminIntroduce'
import SystemIntroduce from '../views/AdminMenu/SystemIntroduce'
import BookingMessage from '../views/AdminMenu/BookingMessage'
import LackVaccineMessage from '../views/AdminMenu/LackVaccineMessage'
import VaccineRequest from '../views/AdminMenu/VaccineRequest'
import VaccineNumber from '../views/AdminMenu/VaccineNumber'
import RequestProcess from '../views/AdminMenu/RequestProcess'
import DataCompute from '../views/AdminMenu/DataCompute'
import AttentionChart from '../views/AdminMenu/AttentionChart'
import RequestReply from '../views/AdminMenu/RequestReply'
import RequestDetail from '../views/AdminMenu/RequestDetail'
import BulkUpdate from '../views/AdminMenu/VaccineNumberControl/BulkUpdate'
import UpdateInstitution from '../views/AdminMenu/UpdateInstitution'
import BulkResult from '../views/AdminMenu/VaccineNumberControl/BulkResult'
import MyFamily from '../views/UserMenu/MyFamily'
import UserCheckInstitution from '../views/UserMenu/VaccineItem/UserCheckInstitution'
import MyBookingMessage from '../views/UserMenu/MyBookingMessage'
import UserCheckInstitution1 from '../views/UserMenu/UserCheckInstitution1'
import ForNm from '../views/UserMenu/ChatRoom/ForNm'
import ForDetail from '../views/UserMenu/ChatRoom/ForDetail'
import ChatPublication from '../views/UserMenu/ChatRoom/ChatPublication'
import CompleteBooking from '../views/UserMenu/CompleteBooking'
import AdminForNm from '../views/AdminMenu/ChatRoom/ForNm'
import AdminForDetail from '../views/AdminMenu/ChatRoom/ForDetail'
import AdminChatPublication from '../views/AdminMenu/ChatRoom/ChatPublication'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/AdminHome',
    name: 'AdminHome',
    component: AdminHome,
    children: [
      {
        path: '/AdminIntroduce',
        name: 'AdminIntroduce',
        component: AdminIntroduce
      },
      {
        path: '/SystemIntroduce',
        name: 'SystemIntroduce',
        component: SystemIntroduce
      },
      {
        path: '/BookingMessage',
        name: 'BookingMessage',
        component: BookingMessage
      },
      {
        path: '/LackVaccineMessage',
        name: 'LackVaccineMessage',
        component: LackVaccineMessage
      },
      {
        path: '/VaccineRequest',
        name: 'VaccineRequest',
        component: VaccineRequest
      },
      {
        path: '/VaccineNumber',
        name: 'VaccineNumber',
        component: VaccineNumber
      },
      {
        path: '/RequestProcess',
        name: 'RequestProcess',
        component: RequestProcess
      },
      {
        path: '/DataCompute',
        name: 'DataCompute',
        component: DataCompute
      },
      {
        path: '/AttentionChart',
        name: 'AttentionChart',
        component: AttentionChart
      },
      {
        path: '/RequestReply',
        name: 'RequestReply',
        component: RequestReply
      },
      {
        path: '/RequestDetail',
        name: 'RequestDetail',
        component: RequestDetail
      },
      {
        path: '/BulkUpdate',
        name: 'BulkUpdate',
        component: BulkUpdate
      },
      {
        path: '/UpdateInstitution',
        name: 'UpdateInstitution',
        component: UpdateInstitution
      },
      {
        path: '/BulkResult',
        name: 'BulkResult',
        component: BulkResult
      },
      {
        path: '/ForNm',
        name: 'FroNm',
        component: ForNm
      },
      {
        path: '/ForDetail',
        name: 'ForDetail',
        component: ForDetail
      },
      {
        path: '/ChatPublication',
        name: 'ChatPublication',
        component: ChatPublication
      },
      {
        path: '/AdminForNm',
        name: 'AdminFroNm',
        component: AdminForNm
      },
      {
        path: '/AdminForDetail',
        name: 'AdminForDetail',
        component: AdminForDetail
      },
      {
        path: '/AdminChatPublication',
        name: 'AdminChatPublication',
        component: AdminChatPublication
      }
    ]
  },
  {
    path: '/AdminLogin',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/HomeIndex',
    name: 'HomeIndex',
    component: HomeIndex
  },
  {
    path: '/UserLogin',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/UserRegister',
    name: 'AdminRegister',
    component: UserRegister
  },
  {
    path: '/UserHome',
    name: 'UserHome',
    component: UserHome,
    children: [
      {
        path: '/MenuTest',
        name: 'MenuTest',
        component: MenuTest
      },
      {
        path: '/BasicInformation',
        name: 'BasicInformation',
        component: BasicInformation
      },
      {
        path: '/VaccingRecord',
        name: 'VaccingRecord',
        component: VaccingRecord
      },
      {
        path: '/AllergyRegister',
        name: 'AllergyRegister',
        component: AllergyRegister
      },
      {
        path: '/VaccineShop',
        name: 'VaccineShop',
        component: VaccineShop
      },
      {
        path: '/VaccineItem',
        name: 'VaccineItem',
        component: VaccineItem
      },
      {
        path: '/VaccineInstitution',
        name: 'VaccineInstitution',
        component: VaccineInstitution
      },
      {
        path: '/VaccineAttentionList',
        name: 'VaccineAttentionList',
        component: VaccineAttentionList
      },
      {
        path: '/LackRegister',
        name: 'LackRegister',
        component: LackRegister
      },
      {
        path: '/MyBooking',
        name: 'MyBooking',
        component: MyBooking
      },
      {
        path: '/MyFamily',
        name: 'MyFamily',
        component: MyFamily
      },
      {
        path: '/UserCheckInstitution',
        name: 'UserCheckInstitution',
        component: UserCheckInstitution
      },
      {
        path: '/MyBookingMessage',
        name: 'MyBookingMessage',
        component: MyBookingMessage
      },
      {
        path: '/UserCheckInstitution1',
        name: 'UserCheckInstitution1',
        component: UserCheckInstitution1
      },
      {
        path: '/ForNm',
        name: 'FroNm',
        component: ForNm
      },
      {
        path: '/ForDetail',
        name: 'ForDetail',
        component: ForDetail
      },
      {
        path: '/ChatPublication',
        name: 'ChatPublication',
        component: ChatPublication
      },
      {
        path: '/CompleteBooking',
        name: 'CompleteBooking',
        component: CompleteBooking
      }
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
