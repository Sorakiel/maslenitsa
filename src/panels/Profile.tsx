import { Icon24Chevron } from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'
import { Avatar, Group, Panel, PanelHeader, SimpleCell } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

const Profile = ({ onNavigate }: { onNavigate: (panel: string) => void }) => {
	const [userInfo, setUserInfo] = useState<{
		id: number
		first_name: string
		last_name: string
		photo_200: string
	} | null>(null)
	const [collectedCount, setCollectedCount] = useState(0)

	useEffect(() => {
		bridge.send('VKWebAppGetUserInfo').then(data => {
			setUserInfo(data)
		})
		const collectedPuzzles = JSON.parse(
			localStorage.getItem('collectedPuzzles') || '[]'
		)
		setCollectedCount(collectedPuzzles.length)
	}, [])

	return (
		<Panel>
			<PanelHeader>Профиль</PanelHeader>
			<Group>
				{userInfo && (
					<SimpleCell
						before={<Avatar size={72} src={userInfo.photo_200} />}
						subtitle={'Москва'}
					>
						<div>
							{userInfo.first_name} {userInfo.last_name}
						</div>
					</SimpleCell>
				)}
				<SimpleCell
					onClick={() => onNavigate('collected')}
					after={<Icon24Chevron />}
				>
					Собранные пазлы
				</SimpleCell>
				<SimpleCell
					onClick={() => onNavigate('leaderboard')}
					after={<Icon24Chevron />}
				>
					Лидерборд
				</SimpleCell>
				<SimpleCell
					after={
						<div
							style={{ display: 'flex', alignItems: 'center', width: '200px' }}
						>
							<div
								style={{
									position: 'relative',
									flexGrow: 1,
									height: '6px',
									minWidth: '150px',
								}}
							>
								<div
									style={{
										position: 'absolute',
										width: '100%',
										height: '6px',
										backgroundColor: '#E7E8EA',
										borderRadius: '3px',
									}}
								/>
								<div
									style={{
										position: 'absolute',
										width: `${(collectedCount / 12) * 100}%`,
										height: '6px',
										backgroundColor: '#2688eb',
										borderRadius: '3px',
										transition: 'width 0.3s ease',
									}}
								/>
							</div>
							<span
								style={{
									marginLeft: '8px',
									color: '#818C99',
									fontSize: '14px',
								}}
							>
								{collectedCount}/12
							</span>
						</div>
					}
				>
					Прогресс
				</SimpleCell>
			</Group>
		</Panel>
	)
}

export default Profile
