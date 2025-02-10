import bridge from '@vkontakte/vk-bridge'
import {
	Epic,
	Panel,
	PanelHeader,
	Tabbar,
	TabbarItem,
	View,
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import './styles.css'

import { Icon28MenuOutline, Icon28PictureOutline } from '@vkontakte/icons'
import { CollectedPuzzles } from './panels/CollectedPuzzles'
import { Home } from './panels/Home'
import { Leaderboard } from './panels/Leaderboard'
import { Profile } from './panels/Profile'

export const App = () => {
	const [activeStory, setActiveStory] = useState('profile')

	useEffect(() => {
		// Инициализация VK Bridge
		bridge.send('VKWebAppInit')
	}, [])

	return (
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
					<Leaderboard />
				</Panel>
			</View>
		</Epic>
	)
}
