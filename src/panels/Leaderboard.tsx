import { Avatar, Group, Header, SimpleCell } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

interface LeaderboardEntry {
	id: number
	name: string
	score: number
}

export const Leaderboard = () => {
	const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])

	useEffect(() => {
		// Загрузка таблицы лидеров из локального хранилища
		const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]')
		setLeaders(
			leaderboard.sort(
				(a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score
			)
		)
	}, [])

	return (
		<Group header={<Header>Лидерборд</Header>}>
			{leaders.map((entry, index) => (
				<SimpleCell
					key={index}
					before={<Avatar size={40} />}
					subtitle={`${entry.score} баллов`}
				>
					{entry.name}
				</SimpleCell>
			))}
		</Group>
	)
}
