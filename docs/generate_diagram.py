import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_table(ax, x, y, width, header_text, columns, header_bg='#0F172A', body_bg='#FFFFFF', border_color='#CBD5E1'):
    row_height = 0.36
    header_height = 0.55
    total_height = header_height + len(columns) * row_height

    # Shadow
    shadow = patches.FancyBboxPatch(
        (x + 0.08, y - total_height - 0.08), width, total_height,
        boxstyle="round,pad=0.06,rounding_size=0.12",
        edgecolor='none', facecolor='#CBD5E1', alpha=0.5, zorder=1
    )
    ax.add_patch(shadow)

    # Main Card Box
    box = patches.FancyBboxPatch(
        (x, y - total_height), width, total_height,
        boxstyle="round,pad=0.06,rounding_size=0.12",
        edgecolor=border_color, facecolor=body_bg, linewidth=1.5, zorder=2
    )
    ax.add_patch(box)

    # Header Box
    header = patches.FancyBboxPatch(
        (x, y - header_height), width, header_height,
        boxstyle="round,pad=0.06,rounding_size=0.12",
        edgecolor=border_color, facecolor=header_bg, linewidth=1.5, zorder=3
    )
    ax.add_patch(header)

    # Header Text
    ax.text(
        x + width / 2.0, y - header_height / 2.0, header_text,
        ha='center', va='center', color='#FFFFFF', fontsize=10.5, fontweight='bold',
        fontfamily='sans-serif', zorder=4
    )

    # Rows
    current_y = y - header_height
    for i, col in enumerate(columns):
        col_name, col_type, tag = col
        if i % 2 == 1:
            row_bg = patches.Rectangle(
                (x + 0.02, current_y - row_height), width - 0.04, row_height,
                facecolor='#F8FAFC', edgecolor='none', zorder=3
            )
            ax.add_patch(row_bg)

        # Tag
        if tag == 'PK':
            ax.text(x + 0.22, current_y - row_height / 2.0, '[PK]', ha='left', va='center', color='#D97706', fontsize=8, fontweight='bold', fontfamily='monospace', zorder=4)
        elif tag == 'FK':
            ax.text(x + 0.22, current_y - row_height / 2.0, '[FK]', ha='left', va='center', color='#2563EB', fontsize=8, fontweight='bold', fontfamily='monospace', zorder=4)
        elif tag == 'UK':
            ax.text(x + 0.22, current_y - row_height / 2.0, '[UK]', ha='left', va='center', color='#059669', fontsize=8, fontweight='bold', fontfamily='monospace', zorder=4)

        offset_name = 0.95 if tag else 0.32
        ax.text(x + offset_name, current_y - row_height / 2.0, col_name, ha='left', va='center', color='#1E293B', fontsize=8.5, fontweight='bold' if tag else 'normal', fontfamily='sans-serif', zorder=4)
        ax.text(x + width - 0.25, current_y - row_height / 2.0, col_type, ha='right', va='center', color='#64748B', fontsize=8, fontfamily='monospace', zorder=4)

        current_y -= row_height

    return (x, y, width, total_height)

def main():
    fig, ax = plt.subplots(figsize=(19, 10), dpi=240)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 19)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Top Title Block
    title_box = patches.FancyBboxPatch(
        (0.8, 8.85), 17.4, 0.85,
        boxstyle="round,pad=0.08,rounding_size=0.12",
        edgecolor='#E2E8F0', facecolor='#FFFFFF', linewidth=1.2, zorder=2
    )
    ax.add_patch(title_box)

    ax.text(9.5, 9.42, "Portal de Solicitações Internas — Diagrama Entidade-Relacionamento (DER)", ha='center', va='center', fontsize=14, fontweight='bold', color='#0F172A')
    ax.text(9.5, 9.08, "bit Soluções • Modelo Relacional em 3ª Forma Normal (3FN) • Conformidade ANSI-SQL • Integridade Referencial", ha='center', va='center', fontsize=9.5, color='#64748B')

    # Table 1: USUARIOS (Top Left)
    u_cols = [
        ('id', 'INTEGER', 'PK'),
        ('nome', 'VARCHAR(100)', ''),
        ('usuario', 'VARCHAR(50)', 'UK'),
        ('senha_hash', 'VARCHAR(255)', ''),
        ('departamento', 'VARCHAR(50)', ''),
        ('perfil', 'VARCHAR(20)', ''),
        ('criado_em', 'DATETIME', '')
    ]
    u_x, u_y, u_w, u_h = draw_table(ax, 0.8, 8.4, 4.3, "USUARIOS", u_cols, header_bg='#1E293B')

    # Table 2: CATEGORIAS (Bottom Left)
    c_cols = [
        ('id', 'INTEGER', 'PK'),
        ('nome', 'VARCHAR(50)', 'UK'),
        ('descricao', 'VARCHAR(200)', ''),
        ('ativo', 'BOOLEAN', '')
    ]
    c_x, c_y, c_w, c_h = draw_table(ax, 0.8, 4.4, 4.3, "CATEGORIAS", c_cols, header_bg='#0F766E')

    # Table 3: SOLICITACOES (Center)
    s_cols = [
        ('id', 'INTEGER', 'PK'),
        ('codigo', 'VARCHAR(20)', 'UK'),
        ('titulo', 'VARCHAR(150)', ''),
        ('descricao', 'TEXT', ''),
        ('categoria', 'VARCHAR(50)', ''),
        ('status', 'VARCHAR(30)', ''),
        ('usuario_id', 'INTEGER', 'FK'),
        ('data_abertura', 'DATETIME', ''),
        ('data_atualizacao', 'DATETIME', ''),
        ('data_conclusao', 'DATETIME', ''),
        ('observacoes', 'TEXT', '')
    ]
    s_x, s_y, s_w, s_h = draw_table(ax, 6.9, 8.4, 4.8, "SOLICITACOES (Central)", s_cols, header_bg='#1E40AF')

    # Table 4: SOLICITACAO_HISTORICO (Right)
    h_cols = [
        ('id', 'INTEGER', 'PK'),
        ('solicitacao_id', 'INTEGER', 'FK'),
        ('usuario_id', 'INTEGER', 'FK'),
        ('status_anterior', 'VARCHAR(30)', ''),
        ('novo_status', 'VARCHAR(30)', ''),
        ('comentario', 'TEXT', ''),
        ('data_registro', 'DATETIME', '')
    ]
    h_x, h_y, h_w, h_h = draw_table(ax, 13.5, 8.4, 4.7, "SOLICITACAO_HISTORICO (Auditoria)", h_cols, header_bg='#9A3412')

    # RELATIONSHIP LINES

    # 1. USUARIOS -> SOLICITACOES (1 : N)
    u_id_y = u_y - 0.55 - 0.36 * 0.5
    s_uid_y = s_y - 0.55 - 0.36 * 6.5
    ax.annotate(
        "", xy=(s_x, s_uid_y), xytext=(u_x + u_w, u_id_y),
        arrowprops=dict(arrowstyle="-|>", color="#2563EB", lw=2, mutation_scale=14)
    )
    ax.text(u_x + u_w + 0.2, u_id_y + 0.12, "1", color='#1E40AF', fontweight='bold', fontsize=10)
    ax.text(s_x - 0.35, s_uid_y + 0.12, "N", color='#1E40AF', fontweight='bold', fontsize=10)
    ax.text(5.95, (u_id_y + s_uid_y)/2.0 + 0.25, "registra (1:N)", color='#1E40AF', fontsize=8.5, fontweight='bold', ha='center',
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#EFF6FF", edgecolor="#BFDBFE", lw=1))

    # 2. CATEGORIAS -> SOLICITACOES (1 : N)
    c_nome_y = c_y - 0.55 - 0.36 * 1.5
    s_cat_y = s_y - 0.55 - 0.36 * 4.5
    ax.annotate(
        "", xy=(s_x, s_cat_y), xytext=(c_x + c_w, c_nome_y),
        arrowprops=dict(arrowstyle="-|>", color="#0D9488", lw=2, mutation_scale=14)
    )
    ax.text(c_x + c_w + 0.2, c_nome_y + 0.12, "1", color='#0F766E', fontweight='bold', fontsize=10)
    ax.text(s_x - 0.35, s_cat_y - 0.22, "N", color='#0F766E', fontweight='bold', fontsize=10)
    ax.text(5.95, (c_nome_y + s_cat_y)/2.0 - 0.15, "classifica (1:N)", color='#0F766E', fontsize=8.5, fontweight='bold', ha='center',
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#F0FDFA", edgecolor="#99F6E4", lw=1))

    # 3. SOLICITACOES -> SOLICITACAO_HISTORICO (1 : N)
    s_id_y = s_y - 0.55 - 0.36 * 0.5
    h_sid_y = h_y - 0.55 - 0.36 * 1.5
    ax.annotate(
        "", xy=(h_x, h_sid_y), xytext=(s_x + s_w, s_id_y),
        arrowprops=dict(arrowstyle="-|>", color="#EA580C", lw=2, mutation_scale=14)
    )
    ax.text(s_x + s_w + 0.2, s_id_y + 0.12, "1", color='#C2410C', fontweight='bold', fontsize=10)
    ax.text(h_x - 0.35, h_sid_y + 0.12, "N", color='#C2410C', fontweight='bold', fontsize=10)
    ax.text(12.6, (s_id_y + h_sid_y)/2.0 + 0.28, "possui (1:N)", color='#C2410C', fontsize=8.5, fontweight='bold', ha='center',
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#FFF7ED", edgecolor="#FED7AA", lw=1))

    # 4. USUARIOS -> SOLICITACAO_HISTORICO (1 : N) (Underneath connector)
    # Route below the tables: from bottom of USUARIOS to bottom of SOLICITACAO_HISTORICO
    ax.annotate(
        "", xy=(h_x + 2.0, h_y - h_h), xytext=(u_x + 2.0, u_y - u_h),
        arrowprops=dict(arrowstyle="-|>", color="#64748B", lw=1.8, linestyle="--",
                        connectionstyle="arc3,rad=0.28", mutation_scale=14)
    )
    ax.text(9.5, 3.4, "auditoria do executor: USUARIOS (1) -> (N) SOLICITACAO_HISTORICO",
            color='#475569', fontsize=8.5, fontweight='bold', ha='center',
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#F1F5F9", edgecolor="#CBD5E1", lw=1))

    # Bottom Legend / Footer Box
    leg_box = patches.FancyBboxPatch(
        (0.8, 0.4), 17.4, 0.72,
        boxstyle="round,pad=0.08,rounding_size=0.1",
        edgecolor='#E2E8F0', facecolor='#FFFFFF', linewidth=1.2, zorder=2
    )
    ax.add_patch(leg_box)

    ax.text(1.2, 0.76, "LEGENDA DO MODELO:", color='#0F172A', fontsize=9, fontweight='bold')
    ax.text(4.2, 0.76, "[PK] Chave Primária", color='#D97706', fontsize=8.5, fontweight='bold', fontfamily='monospace')
    ax.text(7.2, 0.76, "[FK] Chave Estrangeira", color='#2563EB', fontsize=8.5, fontweight='bold', fontfamily='monospace')
    ax.text(10.2, 0.76, "[UK] Restrição de Unicidade", color='#059669', fontsize=8.5, fontweight='bold', fontfamily='monospace')
    ax.text(14.5, 0.76, "Engine: SQLite 3 (PRAGMA foreign_keys = ON)", color='#475569', fontsize=8.5, fontfamily='sans-serif')

    plt.savefig('docs/modelo_banco_dados.jpg', bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    print("Exact 4-table DER successfully generated at docs/modelo_banco_dados.jpg")

if __name__ == '__main__':
    main()
