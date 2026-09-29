import { SolicitacaoRepository } from '../repositories/solicitacao.repository';
import { DashboardMetrics } from '../models/types';

export class DashboardService {
  private repository: SolicitacaoRepository;

  constructor(repository?: SolicitacaoRepository) {
    this.repository = repository || new SolicitacaoRepository();
  }

  obterMetricas(): DashboardMetrics {
    return this.repository.getDashboardMetrics();
  }
}
