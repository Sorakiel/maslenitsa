import bridge from '@vkontakte/vk-bridge'
import {
	AdaptivityProvider,
	ConfigProvider,
	Epic,
	Panel,
	PanelHeader,
	Tabbar,
	TabbarItem,
	View,
} from '@vkontakte/vkui'
import { lazy, useEffect, useState } from 'react'
import './styles.css'

import { Icon28MenuOutline, Icon28PictureOutline } from '@vkontakte/icons'
const Home = lazy(() => import('./panels/Home'))
const Profile = lazy(() => import('./panels/Profile'))
const Leaderboard = lazy(() => import('./panels/Leaderboard'))
const CollectedPuzzles = lazy(() => import('./panels/CollectedPuzzles'))

export const App = () => {
	const [activeStory, setActiveStory] = useState('profile')

	useEffect(() => {
		bridge
			.send('VKWebAppInit')
			.then(data => {
				console.log('VK Bridge initialized', data)
			})
			.catch(error => {
				console.error('VK Bridge initialization failed', error)
			})
	}, [])

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<Epic
					activeStory={activeStory}
					tabbar={
						<Tabbar>
							<TabbarItem
								onClick={() => setActiveStory('home')}
								selected={activeStory === 'home'}
								text='Пазлы'
							>
								<Icon28PictureOutline />
							</TabbarItem>
							<TabbarItem
								onClick={() => setActiveStory('profile')}
								selected={activeStory === 'profile'}
								text='Профиль'
							>
								<Icon28MenuOutline />
							</TabbarItem>
						</Tabbar>
					}
				>
					<View id='profile' activePanel='profile'>
						<Panel id='profile'>
							<PanelHeader>Профиль</PanelHeader>
							<Profile onNavigate={setActiveStory} />
						</Panel>
					</View>
					<View id='home' activePanel='home'>
						<Panel id='home'>
							<PanelHeader>Пазлы</PanelHeader>
							<Home />
						</Panel>
					</View>
					<View id='collected' activePanel='collected'>
						<Panel id='collected'>
							<PanelHeader>Собранные пазлы</PanelHeader>
							<CollectedPuzzles />
						</Panel>
					</View>
					<View id='leaderboard' activePanel='leaderboard'>
						<Panel id='leaderboard'>
							<PanelHeader>Лидерборд</PanelHeader>
							<Leaderboard id='leaderboard' />
						</Panel>
					</View>
				</Epic>
			</AdaptivityProvider>
		</ConfigProvider>
	)
}
