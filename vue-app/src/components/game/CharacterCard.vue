<template>
    <div class="character-card" :class="{ 'character-card-selected': character.is_active }">
        <div class="character-card-header">
            <h3>{{ character.name }}</h3>
            <Badge :type="character.type === 'warrior' ? 'warrior' : 'mage'">
                {{ character.type === 'warrior' ? 'Guerrier' : 'Mage' }}
            </Badge>
            <Badge v-if="character.is_active" type="active">Actif</Badge>
        </div>

        <div class="character-card-body">
            <p>Race: {{ character.race }}</p>
            <p>Niveau: {{ character.level }}</p>
            <div class="stats">
                <div class="stat">
                    <span class="stat-name">Santé</span>
                    <div class="progress">
                        <div class="progress-bar bg-danger" :style="{ width: `${character.health}%` }"></div>
                    </div>
                    <span class="stat-value">{{ character.health }}</span>
                </div>

                <div class="stat">
                    <span class="stat-name">Attaque</span>
                    <div class="progress">
                        <div class="progress-bar bg-primary" :style="{ width: `${character.attack * 5}%` }"></div>
                    </div>
                    <span class="stat-value">{{ character.attack }}</span>
                </div>

                <div class="stat">
                    <span class="stat-name">Défense</span>
                    <div class="progress">
                        <div class="progress-bar bg-success" :style="{ width: `${character.defense * 10}%` }"></div>
                    </div>
                    <span class="stat-value">{{ character.defense }}</span>
                </div>
            </div>
        </div>

        <div class="character-card-footer">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
import Badge from '@/components/ui/Badge.vue'

export default {
    name: 'CharacterCard',
    components: {
        Badge
    },
    props: {
        character: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.character-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    &.character-card-selected {
        border: 3px solid #28a745;
        position: relative;
        overflow: visible;
        background-color: rgba(40, 167, 69, 0.05);

        &::before {
            content: '✓';
            position: absolute;
            top: -15px;
            right: -15px;
            background-color: #28a745;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 600;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
    }
}

.character-card-header {
    padding: 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;

    h3 {
        margin: 0;
        flex-grow: 1;
    }
}

.character-card-body {
    padding: 15px;

    p {
        margin-bottom: 0.5rem;
    }
}

.character-card-footer {
    padding: 15px;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
}

.stats {
    margin-top: 10px;
}

.stat {
    margin-bottom: 10px;

    .stat-name {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
    }

    .progress {
        height: 12px;
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.1);
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        margin-bottom: 5px;
    }

    .progress-bar {
        transition: width 0.8s ease;
    }

    .stat-value {
        text-align: right;
        font-size: 14px;
        color: #6c757d;
    }
}
</style>
