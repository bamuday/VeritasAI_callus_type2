"""initial authentication and persistence tables"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("avatar_url", sa.String(length=2000), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "auth_accounts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("provider", sa.String(length=40), nullable=False),
        sa.Column("provider_account_id", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("provider", "provider_account_id", name="uq_auth_provider_account"),
    )
    op.create_index("ix_auth_accounts_user_id", "auth_accounts", ["user_id"])

    op.create_table(
        "essays",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=500), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("word_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_essays_user_id", "essays", ["user_id"])

    op.create_table(
        "analyses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("essay_id", sa.Integer(), nullable=False),
        sa.Column("detector_version", sa.String(length=100), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=True),
        sa.Column("flag_level", sa.String(length=20), nullable=True),
        sa.Column("explanation", sa.Text(), nullable=True),
        sa.Column("result_json", postgresql.JSONB(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["essay_id"], ["essays.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_analyses_essay_id", "analyses", ["essay_id"])

    op.create_table(
        "sentence_analyses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("analysis_id", sa.Integer(), nullable=False),
        sa.Column("sentence_index", sa.Integer(), nullable=False),
        sa.Column("paragraph_index", sa.Integer(), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("flag_level", sa.String(length=20), nullable=False),
        sa.Column("signal_score", sa.Float(), nullable=False),
        sa.Column("passage_category", sa.String(length=100), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.Column("signals_json", postgresql.JSONB(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_sentence_analyses_analysis_id", "sentence_analyses", ["analysis_id"])


def downgrade() -> None:
    op.drop_index("ix_sentence_analyses_analysis_id", table_name="sentence_analyses")
    op.drop_table("sentence_analyses")
    op.drop_index("ix_analyses_essay_id", table_name="analyses")
    op.drop_table("analyses")
    op.drop_index("ix_essays_user_id", table_name="essays")
    op.drop_table("essays")
    op.drop_index("ix_auth_accounts_user_id", table_name="auth_accounts")
    op.drop_table("auth_accounts")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
