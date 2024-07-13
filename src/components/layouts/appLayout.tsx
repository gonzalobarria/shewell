import { ReactNode } from 'react'

import { fonts } from '@/lib/fontApp'

import SideBar from './sideBar'
import TopNav from './topNav'

type AppLayoutProps = { children: ReactNode }

const AppLayout = ({ children }: AppLayoutProps) => (
  <div className={`${fonts} relative h-screen`}>
    <div className="flex min-h-screen w-full flex-col bg-[#C0C0FB]/40">
      <SideBar />
      <div className="flex flex-col sm:pl-14">
        <TopNav />
        <main>{children}</main>
      </div>
    </div>
  </div>
)

export default AppLayout
