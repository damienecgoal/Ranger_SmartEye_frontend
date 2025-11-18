// assets
import { Book1, I24Support, Profile2User, KyberNetwork } from 'iconsax-reactjs';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Book1,
  applications: KyberNetwork,
  membership: Profile2User,
  helpdesk: I24Support
};

// ==============================|| MENU ITEMS - ADMIN PANEL ||============================== //

const adminPanel: NavItemType = {
  id: 'group-admin-panel',
  title: 'admin-panel',
  icon: icons.applications,
  type: 'group',
  children: [
    // {
    //   id: 'online-courses',
    //   title: 'online-courses',
    //   type: 'collapse',
    //   icon: icons.dashboard,
    //   children: [
    //     {
    //       id: 'dashboard',
    //       title: 'dashboard',
    //       type: 'item',
    //       breadcrumbs: false,
    //       url: '/admin-panel/online-course/dashboard'
    //     },
    //     {
    //       id: 'teacher',
    //       title: 'teacher',
    //       type: 'collapse',
    //       children: [
    //         {
    //           id: 'list',
    //           title: 'list',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/teacher/list'
    //         },
    //         {
    //           id: 'apply',
    //           title: 'apply',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/teacher/applied'
    //         },
    //         {
    //           id: 'add',
    //           title: 'add',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/teacher/add'
    //         }
    //       ]
    //     },
    //     {
    //       id: 'student',
    //       title: 'student',
    //       type: 'collapse',
    //       children: [
    //         {
    //           id: 'list',
    //           title: 'list',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/student/list'
    //         },
    //         {
    //           id: 'apply',
    //           title: 'apply',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/student/applied'
    //         },
    //         {
    //           id: 'add',
    //           title: 'add',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/student/add'
    //         }
    //       ]
    //     },
    //     {
    //       id: 'courses',
    //       title: 'courses',
    //       type: 'collapse',
    //       children: [
    //         {
    //           id: 'view',
    //           title: 'view',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/courses/view'
    //         },
    //         {
    //           id: 'add',
    //           title: 'add',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/courses/add'
    //         }
    //       ]
    //     },
    //     {
    //       id: 'pricing',
    //       title: 'pricing',
    //       type: 'item',
    //       breadcrumbs: false,
    //       url: '/admin-panel/online-course/pricing'
    //     },
    //     {
    //       id: 'site',
    //       title: 'site',
    //       type: 'item',
    //       breadcrumbs: false,
    //       url: '/admin-panel/online-course/site'
    //     },
    //     {
    //       id: 'setting',
    //       title: 'setting',
    //       type: 'collapse',
    //       children: [
    //         {
    //           id: 'payment',
    //           title: 'payment',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/setting/payment'
    //         },
    //         {
    //           id: 'pricing',
    //           title: 'pricing',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/setting/pricing'
    //         },
    //         {
    //           id: 'notification',
    //           title: 'notification',
    //           type: 'item',
    //           breadcrumbs: false,
    //           url: '/admin-panel/online-course/setting/notification'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 'membership',
    //   title: 'membership',
    //   type: 'collapse',
    //   icon: icons.membership,
    //   children: [
    //     {
    //       id: 'dashboard',
    //       title: 'dashboard',
    //       type: 'item',
    //       url: '/admin-panel/membership/dashboard',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'list',
    //       title: 'list',
    //       type: 'item',
    //       url: '/admin-panel/membership/list',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'pricing',
    //       title: 'pricing',
    //       type: 'item',
    //       url: '/admin-panel/membership/pricing',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'setting',
    //       title: 'setting',
    //       type: 'item',
    //       url: '/admin-panel/membership/setting',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    {
      id: 'helpdesk',
      title: 'helpdesk',
      type: 'collapse',
      icon: icons.helpdesk,
      children: [
        {
          id: 'dashboard',
          title: 'dashboard',
          type: 'item',
          url: '/admin-panel/helpdesk/dashboard',
          breadcrumbs: false
        },
        {
          id: 'ticket',
          title: 'ticket',
          type: 'collapse',
          children: [
            {
              id: 'create',
              title: 'create',
              type: 'item',
              url: '/admin-panel/helpdesk/create-ticket',
              breadcrumbs: false
            },
            {
              id: 'list',
              title: 'list',
              type: 'item',
              url: '/admin-panel/helpdesk/ticket-list',
              breadcrumbs: false
            },
            {
              id: 'details',
              title: 'details',
              type: 'item',
              url: '/admin-panel/helpdesk/ticket-details',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'customer',
          title: 'customer',
          type: 'item',
          url: '/admin-panel/helpdesk/customer',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default adminPanel;
