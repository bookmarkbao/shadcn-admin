import {
  LayoutDashboard,
  ListTodo,
  Package,
  Users,
  MessagesSquare,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  BookA,
  SpeechIcon,
  FolderOpenIcon,
  PlugIcon,
  SubtitlesIcon,
  VideoIcon,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: '',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },

        {
          title: '我的词库',
          url: '/word-library',
          icon: BookA,
        },
        {
          title: '我的表达库',
          url: '/express-library',
          icon: SpeechIcon,
        },
        {
          title: '媒体资源库',
          url: '/media-library',
          icon: VideoIcon,
        },
        {
          title: '字幕搜索库',
          url: '/subtitle-library',
          icon: SubtitlesIcon,
        },
        {
          title: '我的插件库',
          url: '/plugin-library',
          icon: PlugIcon,
        },
        {
          title: '我的空间管理',
          url: '/workspace-library',
          icon: FolderOpenIcon,
        },
      ],
    },
  ],
}
