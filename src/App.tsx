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
import { useEffect, useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import './styles.css'

import { Icon28MenuOutline, Icon28PictureOutline } from '@vkontakte/icons'
import CollectedPuzzles from './panels/CollectedPuzzles'
import Home from './panels/Home'
import Leaderboard from './panels/Leaderboard'
import Profile from './panels/Profile'

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
				<ErrorBoundary>
					<Epic
						activeStory={activeStory}
						tabbar={
							<Tabbar>
								<TabbarItem
									onClick={() => setActiveStory('home')}
									selected={activeStory === 'home'}
									label='Пазлы'
								>
									<Icon28PictureOutline />
								</TabbarItem>
								<TabbarItem
									onClick={() => setActiveStory('profile')}
									selected={activeStory === 'profile'}
									label='Профиль'
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
				</ErrorBoundary>
			</AdaptivityProvider>
		</ConfigProvider>
	)
}
