"""adding location string to db

Revision ID: ce864af0ef68
Revises: a8212ab20548
Create Date: 2025-05-28 19:34:10.805389

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ce864af0ef68'
down_revision: Union[str, None] = 'a8212ab20548'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop tables in correct order (dependencies first)
    op.drop_table('user_rounds')
    op.drop_table('rounds')

    # Recreate rounds table WITH the new location_string column
    op.create_table('rounds',
                    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
                    sa.Column('round_number', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('game_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('area_name', sa.TEXT(), autoincrement=False, nullable=True),
                    sa.Column('location_string', sa.TEXT(), autoincrement=False, nullable=True),  # NEW COLUMN
                    sa.Column('location_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(['game_id'], ['games.id'], name=op.f('rounds_game_id_fkey')),
                    sa.ForeignKeyConstraint(['location_id'], ['locations.id'], name=op.f('rounds_location_id_fkey')),
                    sa.PrimaryKeyConstraint('id', name=op.f('rounds_pkey'))
                    )

    # Recreate user_rounds table
    op.create_table('user_rounds',
                    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
                    sa.Column('round_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('guess_lat', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('guess_lng', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('distance_off', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('round_score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('submitted_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(['round_id'], ['rounds.id'], name=op.f('user_rounds_round_id_fkey')),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('user_rounds_user_id_fkey')),
                    sa.PrimaryKeyConstraint('id', name=op.f('user_rounds_pkey'))
                    )


def downgrade() -> None:
    """Downgrade schema."""
    # Drop tables
    op.drop_table('user_rounds')
    op.drop_table('rounds')

    # Recreate original rounds table WITHOUT location_string
    op.create_table('rounds',
                    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
                    sa.Column('round_number', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('game_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('area_name', sa.TEXT(), autoincrement=False, nullable=True),
                    # NO location_string column in downgrade
                    sa.Column('location_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(['game_id'], ['games.id'], name=op.f('rounds_game_id_fkey')),
                    sa.ForeignKeyConstraint(['location_id'], ['locations.id'], name=op.f('rounds_location_id_fkey')),
                    sa.PrimaryKeyConstraint('id', name=op.f('rounds_pkey'))
                    )

    # Recreate user_rounds table
    op.create_table('user_rounds',
                    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
                    sa.Column('round_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('guess_lat', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('guess_lng', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('distance_off', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('round_score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
                    sa.Column('submitted_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(['round_id'], ['rounds.id'], name=op.f('user_rounds_round_id_fkey')),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('user_rounds_user_id_fkey')),
                    sa.PrimaryKeyConstraint('id', name=op.f('user_rounds_pkey'))
                    )