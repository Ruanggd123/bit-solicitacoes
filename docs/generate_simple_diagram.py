import matplotlib.pyplot as plt
import matplotlib.patches as patches

def main():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=240)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # Top Header
    header_box = patches.FancyBboxPatch(
        (0.8, 7.85), 14.4, 0.85,
        boxstyle="round,pad=0.08,rounding_size=0.12",
        edgecolor='#E2E8F0', facecolor='#FFFFFF', linewidth=1.5, zorder=2
    )
    ax.add_patch(header_box)
    ax.text(8.0, 8.4, "Como os Dados se Conversam no Sistema (Modelo Simplificado)",
            ha='center', va='center', fontsize=14.5, fontweight='bold', color='#0F172A')
    ax.text(8.0, 8.04, "Apenas 4 peças simples que fazem todo o Portal de Solicitações funcionar",
            ha='center', va='center', fontsize=9.5, color='#64748B')

    # Helper function for friendly cards
    def create_card(x, y, w, h, step_num, title, subtitle, bullets, theme_color, bg_color='#FFFFFF'):
        shadow = patches.FancyBboxPatch(
            (x + 0.08, y - h - 0.08), w, h,
            boxstyle="round,pad=0.08,rounding_size=0.15",
            edgecolor='none', facecolor='#CBD5E1', alpha=0.45, zorder=1
        )
        ax.add_patch(shadow)

        card = patches.FancyBboxPatch(
            (x, y - h), w, h,
            boxstyle="round,pad=0.08,rounding_size=0.15",
            edgecolor=theme_color, facecolor=bg_color, linewidth=2.0, zorder=2
        )
        ax.add_patch(card)

        # Header Pill
        pill = patches.FancyBboxPatch(
            (x + 0.25, y - 0.65), w - 0.5, 0.5,
            boxstyle="round,pad=0.06,rounding_size=0.1",
            edgecolor='none', facecolor=theme_color, zorder=3
        )
        ax.add_patch(pill)

        ax.text(x + w/2.0, y - 0.40, f"{step_num}. {title}",
                ha='center', va='center', fontsize=11, fontweight='bold', color='#FFFFFF', zorder=4)

        ax.text(x + w/2.0, y - 0.95, subtitle,
                ha='center', va='center', fontsize=8.5, fontweight='bold', color=theme_color, zorder=4)

        # Bullets
        curr_y = y - 1.30
        for b in bullets:
            ax.text(x + 0.35, curr_y, ">", fontsize=9, fontweight='bold', color=theme_color, zorder=4)
            ax.text(x + 0.60, curr_y, b, fontsize=8.5, color='#334155', zorder=4)
            curr_y -= 0.32

    # CARD 1: USUÁRIOS
    create_card(
        x=0.8, y=7.4, w=4.2, h=3.0,
        step_num="1", title="USUÁRIOS",
        subtitle="Quem usa e acessa o portal",
        bullets=[
            "Nome e Login único",
            "Senha criptografada (Bcrypt)",
            "Departamento do colaborador",
            "Perfil (Admin, Gestor, Colaborador)"
        ],
        theme_color="#2563EB"
    )

    # CARD 2: CATEGORIAS
    create_card(
        x=0.8, y=4.0, w=4.2, h=2.8,
        step_num="2", title="CATEGORIAS",
        subtitle="Para onde vai a demanda",
        bullets=[
            "Setores da empresa:",
            "  - TI (Suporte e Sistemas)",
            "  - RH (Recursos Humanos)",
            "  - Compras, Financeiro, Infra"
        ],
        theme_color="#0D9488"
    )

    # CARD 3: SOLICITAÇÕES (CENTRAL)
    create_card(
        x=5.8, y=7.4, w=4.8, h=6.2,
        step_num="3", title="SOLICITAÇÕES (O Chamado)",
        subtitle="O coração do sistema",
        bullets=[
            "Protocolo único (ex: SOL-2026-0001)",
            "Título da necessidade",
            "Descrição detalhada do problema",
            "Status: Aberto | Em Atendimento | Concluído",
            "Data de abertura (automática pelo sistema)",
            "Data de conclusão (quando finaliza)",
            "Quem abriu (ID do usuário conectado)",
            "",
            "REGRA DE OURO DO EDITAL:",
            "Só permite Editar ou Excluir se o",
            "status ainda for 'Aberto'!",
            "(Em Atendimento/Concluído fica bloqueado)"
        ],
        theme_color="#1E40AF"
    )

    # CARD 4: HISTÓRICO DE AUDITORIA
    create_card(
        x=11.4, y=7.4, w=3.8, h=3.3,
        step_num="4", title="HISTÓRICO",
        subtitle="Linha do Tempo e Auditoria",
        bullets=[
            "Registra cada mudança de status",
            "Quem fez a alteração",
            "Status anterior -> Novo status",
            "Comentário / Despacho técnico",
            "Data e hora exata da ação"
        ],
        theme_color="#EA580C"
    )

    # CONNECTING ARROWS

    # Arrow 1: Usuários -> Solicitações
    ax.annotate(
        "", xy=(5.8, 6.2), xytext=(5.0, 6.2),
        arrowprops=dict(arrowstyle="-|>", color="#2563EB", lw=2.5, mutation_scale=16)
    )
    ax.text(5.4, 6.55, "Registra\nchamado", color='#1E40AF', fontsize=8, fontweight='bold', ha='center',
            bbox=dict(boxstyle="round,pad=0.2", facecolor="#EFF6FF", edgecolor="#BFDBFE", lw=1))

    # Arrow 2: Categorias -> Solicitações
    ax.annotate(
        "", xy=(5.8, 2.6), xytext=(5.0, 2.6),
        arrowprops=dict(arrowstyle="-|>", color="#0D9488", lw=2.5, mutation_scale=16)
    )
    ax.text(5.4, 2.95, "Classifica\no setor", color='#0F766E', fontsize=8, fontweight='bold', ha='center',
            bbox=dict(boxstyle="round,pad=0.2", facecolor="#F0FDFA", edgecolor="#99F6E4", lw=1))

    # Arrow 3: Solicitações -> Histórico
    ax.annotate(
        "", xy=(11.4, 6.2), xytext=(10.6, 6.2),
        arrowprops=dict(arrowstyle="-|>", color="#EA580C", lw=2.5, mutation_scale=16)
    )
    ax.text(11.0, 6.55, "Gera histórico\ne auditoria", color='#C2410C', fontsize=8, fontweight='bold', ha='center',
            bbox=dict(boxstyle="round,pad=0.2", facecolor="#FFF7ED", edgecolor="#FED7AA", lw=1))

    # Bottom Summary Box
    expl_box = patches.FancyBboxPatch(
        (0.8, 0.4), 14.4, 0.55,
        boxstyle="round,pad=0.08,rounding_size=0.1",
        edgecolor='#CBD5E1', facecolor='#FFFFFF', linewidth=1.2, zorder=2
    )
    ax.add_patch(expl_box)
    ax.text(8.0, 0.68, "RESUMO PRÁTICO: O Usuário escolhe uma Categoria e abre a Solicitação. Toda mudança de status gera um registro no Histórico.",
            ha='center', va='center', fontsize=9, fontweight='bold', color='#1E293B')

    plt.savefig('docs/modelo_banco_dados.jpg', bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    print("Clean diagram without font warnings generated successfully.")

if __name__ == '__main__':
    main()
