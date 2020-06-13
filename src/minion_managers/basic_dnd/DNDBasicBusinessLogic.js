import * as Constants from './Constants.js';
import Minion from './Minion.js';

export default class DNDBasicBusinessLogic {

	update(state) {
		for (let i=0; i<state.minions.length; i++) {
			this._update_minion( state.minions[i] );
		}
		this._update_damage_total(state);
	}

	_update_minion(minion) {
		this._compute_attack(minion);
		this._compute_damage(minion);
		this._compute_check(minion);
	}

	_roll_die(die) {
      return Math.ceil(Math.random() * die);
    }

	_compute_attack(minion) {
		if (minion.selected_weapon.is_saving_throw) {
			minion.attack_is_save_dc = true;
			if (minion.selected_weapon.should_override_stats) {
				minion.attack_roll = minion.selected_weapon.attack_mod;
			} else {
				minion.attack_roll = 8 + 
				this._stat_type_to_modifier(minion.spellcasting_mod, minion) + 
				minion.proficiency_mod + 
				minion.selected_weapon.attack_mod;
			}
			minion.attack = minion.attack_roll;
		} else {
			minion.attack_is_save_dc = false;
			if (minion.should_reroll_attack) {
				minion.attack_rolls = [ this._roll_die(20), this._roll_die(20) ];
			}
			minion.attack_roll = Constants.switch_on_roll_type(
				minion.attack_roll_type, 
				minion.attack_rolls[0], 
				Math.max(minion.attack_rolls[0],minion.attack_rolls[1]), 
				Math.min(minion.attack_rolls[0],minion.attack_rolls[1])
			);
			if (minion.selected_weapon.should_override_stats) {
				minion.attack = minion.attack_roll + minion.selected_weapon.attack_mod;
			} else {
				minion.attack = minion.attack_roll + 
					minion.selected_weapon.attack_mod + 
					this._stat_type_to_modifier(minion.selected_weapon.stat, minion) + 
					(minion.selected_weapon.proficiency_requirements.every(stat => this._is_minion_proficient(stat, minion)) ? minion.proficiency_mod : 0);
			}
		}
		
	}

	_compute_damage(minion) {
		if (minion.should_reroll_damage) {
			let double_dice = [].concat(minion.selected_weapon.damage_dice, minion.selected_weapon.damage_dice);
			minion.damage_rolls = Array.from(double_dice, this._roll_die);
		}
		minion.damage = 0;
		if (minion.attack_roll == 1 && !minion.selected_weapon.is_saving_throw) {//Critical Miss
			return; //No Damage
		} else if (minion.attack_roll == 20 && !minion.selected_weapon.is_saving_throw) { //Critical Hit
			for (let i=0; i<minion.damage_rolls.length; i++) {
				minion.damage += minion.damage_rolls[i];
			}
		} else {
			for (let i=0; i<minion.damage_rolls.length/2; i++) {
				minion.damage += minion.damage_rolls[i];
			}
		}
		if (!minion.selected_weapon.should_override_stats && !minion.selected_weapon.is_saving_throw) {
			minion.damage += this._stat_type_to_modifier(minion.selected_weapon.stat, minion);
		}
		minion.damage += minion.selected_weapon.damage_mod;
	}

	_compute_check(minion) {
		if (minion.should_reroll_check) {
			minion.check_rolls = [ this._roll_die(20), this._roll_die(20) ];
		}
		minion.check_roll = Constants.switch_on_roll_type(
			minion.check_roll_type,
			minion.check_rolls[0],
			Math.max(minion.check_rolls[0],minion.check_rolls[1]),
			Math.min(minion.check_rolls[0],minion.check_rolls[1])
		);

		for (let check in Constants.checks) {
			let minion_check_settings = minion.checks[check];
			let modifiers = 0;
			if (minion_check_settings.should_override) {
				modifiers = minion_check_settings.override_value;
			} else {
				if (minion_check_settings.has_proficiency) {
					modifiers = minion.proficiency_mod;
				}
				modifiers += this._stat_type_to_modifier(Constants.checks[check].type, minion);
			}
			let variable_name = Constants.convert_check_to_variable_name(check);
			minion[variable_name] = minion.check_roll + modifiers;
		}
	}

	_stat_type_to_modifier(stat_type, minion) {
		return minion[stat_type + '_mod'];
	}

	_update_damage_total(state) {
		let total_damage = 0;
		state.minions.forEach(minion => {
			total_damage += minion.damage_contribute_to_total ? minion.damage : 0;
		});
		state.total_damage = total_damage;
	}

	_is_minion_proficient(stat_type, minion) {
		let check = minion.checks[stat_type];
		if (check != undefined && check.has_proficiency) {
			return true;
		}
		let other_proficiencies = minion.other_proficiencies[stat_type];
		if (other_proficiencies != undefined && other_proficiencies.has_proficiency) {
			return true;
		}
		return false;
	}
}