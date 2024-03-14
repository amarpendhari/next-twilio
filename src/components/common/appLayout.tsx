import React from 'react';
import SideMenu from './sidemenu';
import Header from './header';

const AppLayout = (props: any) => {

    const { childern } = props

    return (
        <div className='app-layout'>
            <SideMenu />
            <div>
                <Header />
                {childern}
            </div>
        </div>
    )
}

export default AppLayout