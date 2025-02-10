import { Icon24Chevron } from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'
import { Avatar, Group, Header, Progress, SimpleCell } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

export const Profile = ({
	onNavigate,
}: {
	onNavigate: (panel: string) => void
}) => {
	const [userInfo, setUserInfo] = useState<{
		id: number
		first_name: string
		last_name: string
		photo_200: string
	} | null>(null)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		bridge.send('VKWebAppGetUserInfo').then(data => {
			setUserInfo(data)
		})
		// Загрузка прогресса из локального хранилища
		const collectedPuzzles = JSON.parse(
			localStorage.getItem('collectedPuzzles') || '[]'
		)
		setProgress((collectedPuzzles.length / 12) * 100)
	}, [])

	return (
		<Group header={<Header>Профиль</Header>}>
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
			<SimpleCell>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<span>Прогресс</span>
					<Progress
						value={progress}
						style={{ marginLeft: 10, flexGrow: 1, height: 8, width: '100%' }}
					/>
				</div>
			</SimpleCell>
		</Group>
	)
}
