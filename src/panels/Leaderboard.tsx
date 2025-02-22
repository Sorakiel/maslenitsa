import {
	Avatar,
	Group,
	Header,
	Panel,
	PanelHeader,
	SimpleCell,
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import ApiService from '../services/api'

interface LeaderboardProps {
	id: string
	userScore?: number
}

const Leaderboard = ({ id }: LeaderboardProps) => {
	const [leaderboardData, setLeaderboardData] = useState<{
		leaderboard: Array<{
			position: number
			full_name: string
			photo_url: string
			score: number
		}>
		me: {
			position: number
			score: number
		}
	} | null>(null)

	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const data = await ApiService.getLeaderboard()
				setLeaderboardData(data)
			} catch (error) {
				console.error('Error fetching leaderboard:', error)
			}
		}

		fetchLeaderboard()
	}, [])

	return (
		<Panel id={id}>
			<PanelHeader>Таблица лидеров</PanelHeader>
			<Group header={<Header>Лидерборд</Header>}>
				{leaderboardData?.leaderboard.map(entry => (
					<SimpleCell
						key={entry.position}
						before={<Avatar size={40} src={entry.photo_url} />}
						subtitle={`${entry.score} баллов`}
					>
						{entry.full_name}
					</SimpleCell>
				))}
			</Group>
		</Panel>
	)
}

export default Leaderboard
