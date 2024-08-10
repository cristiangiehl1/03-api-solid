import { Gym } from '@prisma/client'

import { GymsRepository } from '@/repositories/gym-repository'

interface SearchGymsServiceRequest {
  query: string
  page: number
}

interface SearchGymsServiceReponse {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsServiceRequest): Promise<SearchGymsServiceReponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
