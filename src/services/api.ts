const API_BASE_URL = 'https://maslen-back.itc-hub.ru/api/v1'

interface PuzzleInfo {
	id: number
	name: string
	image: string
	assembled: boolean
	score: number | null
	time_spent: number | null
}

interface UserData {
	vk_id: string
	is_notification: boolean
	first_name: string
	last_name: string
	photo_url: string
}

interface LeaderboardData {
	leaderboard: {
		position: number
		full_name: string
		photo_url: string
		score: number
	}[]
	me: {
		position: number
		score: number
	}
}

class ApiService {
	private static async request(endpoint: string, options: RequestInit = {}) {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: localStorage.getItem('vk_id') || '',
			Sign: localStorage.getItem('sign') || '',
			...options.headers,
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
		})

		if (!response.ok) {
			throw new Error(`API Error: ${response.statusText}`)
		}

		return response.json()
	}

	static async getPuzzlesInfo(): Promise<PuzzleInfo[]> {
		return this.request('/puzzles/info/')
	}

	static async createOrGetUser(userData: {
		is_notification: number
		first_name: string
		last_name: string
		photo_url: string
	}): Promise<UserData> {
		return this.request('/user/', {
			method: 'POST',
			body: JSON.stringify(userData),
		})
	}

	static async savePuzzleResult(data: {
		puzzle_id: number
		score: number
		time_spent: number
	}): Promise<{
		message: string
		puzzle_id: number
		score: number
		time_spent: number
		assembled: boolean
	}> {
		return this.request('/savepuzzles/', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	static async getLeaderboard(): Promise<LeaderboardData> {
		return this.request('/leaderboard/')
	}
}

export default ApiService
