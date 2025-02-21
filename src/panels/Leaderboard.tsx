import {
	Avatar,
	Group,
	Header,
	Panel,
	PanelHeader,
	SimpleCell,
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

interface LeaderboardEntry {
	id: number
	name: string
	score: number
}

interface LeaderboardProps {
	id: string
	userScore?: number
}

const Leaderboard = ({ id }: LeaderboardProps) => {
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
		<Panel id={id}>
			<PanelHeader>Таблица лидеров</PanelHeader>
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
		</Panel>
	)
}

export default Leaderboard
