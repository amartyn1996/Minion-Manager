import * as Constants from './Constants.js';
import PrimaryTable from './PrimaryTable.js';
import StateToTableInterface from './StateToTableInterface.js';

export default class StateToPrimaryTableInterface extends StateToTableInterface {
	update_state_from_table(args) {
		let state = args.state;
		let table = args.table;
		let minions = state.minions;
		let center_columns = table.center_columns;

		if (minions.length != center_columns.length) {
			throw 'Could not update table from state. The number of minions in state and the number of central columns in table do to match.';
		}

		for (let i=0; i<minions.length; i++) {
			let minion = minions[i];
			let center_column = center_columns[i];
			this._populate_minion_values_from_ui(minion, center_column);
			this._update_reroll_on_minion(minion, center_column, table);
		}
	}

	update_table_from_state(args) {
		let state = args.state;
		let table = args.table;
		let minions = state.minions;
		let center_columns = table.center_columns;

		if (minions.length != center_columns.length) {
			table.reset_center_columns(minions.length);
			center_columns = table.center_columns;
		}

		for (let i=0; i<minions.length; i++) {
			let minion = minions[i];
			let center_column = center_columns[i];
			this._populate_ui_from_minion_values(minion, center_column);
		}

		table.end_column['cell_damage'].value = state.total_damage;

	}

	initilize_table_from_state(args) {
		let state = args.state;
		let minions = state.minions;
		let table = args.table;

		for (let i=0; i<state.minions.length; i++) {
			let minion = state.minions[i];
			table.center_columns[i].cell_weapon = 
			{ 	
				value: 
				{ 
					selected_option: minion.selected_weapon.nickname, 
					options: minion.weapons.map(weapon => weapon.nickname) 
				},
				background_color: Constants.grey
			};
		}
	}

	/* --- update_table_from_state helpers --- */

	_populate_ui_from_minion_values(minion, primary_table_column) {
		primary_table_column.cell_name.value = minion.nickname;
		this._populate_ui_cell_hit_points(minion, primary_table_column);
		this._populate_ui_cell_attack(minion, primary_table_column);
		this._populate_ui_cell_damage(minion, primary_table_column);
		this._populate_ui_cell_ammunition(minion, primary_table_column);
		primary_table_column.cell_check.value = minion.check_roll;
		this._populate_ui_cell_attack_advantage(minion, primary_table_column);
		this._populate_ui_cell_check_advantage(minion, primary_table_column);
		this._populate_ui_cell_weapon(minion, primary_table_column);
		for (let check in Constants.checks) {
			let variable_name = Constants.convert_check_to_variable_name(check);
			primary_table_column['cell_' + variable_name].value = minion[variable_name];
		}
	}

	_populate_ui_cell_hit_points(minion, primary_table_column) {
		primary_table_column.cell_hit_points.value = minion.hit_points;
		primary_table_column.cell_hit_points.min = 0;
		if (minion.hit_points <= 0) {
			primary_table_column.cell_hit_points.background_color = Constants.red;
			primary_table_column.cell_hit_points.hover_background_color = Constants.light_red
		} else if (minion.hit_points <= minion.max_hit_points / 2) {
			primary_table_column.cell_hit_points.background_color = Constants.orange;
			primary_table_column.cell_hit_points.hover_background_color = Constants.light_orange;
		} else if (minion.hit_points == minion.max_hit_points) {
			primary_table_column.cell_hit_points.background_color = Constants.green;
			primary_table_column.cell_hit_points.hover_background_color = Constants.light_green;
		} else if (minion.hit_points > minion.max_hit_points) {
			primary_table_column.cell_hit_points.background_color = Constants.blue;
			primary_table_column.cell_hit_points.hover_background_color = Constants.light_blue;
		} else {
			primary_table_column.cell_hit_points.background_color = Constants.grey;
			primary_table_column.cell_hit_points.hover_background_color = Constants.light_grey;
		}
	}

	_populate_ui_cell_attack(minion, primary_table_column) {
		primary_table_column.cell_attack.value = minion.attack;
		if (minion.attack_is_save_dc) {
			primary_table_column.cell_attack.background_color = Constants.purple;
			primary_table_column.cell_attack.hover_background_color = Constants.purple;
		} else {
			switch(minion.attack_roll) {
				case 1:
					primary_table_column.cell_attack.background_color = Constants.red;
					primary_table_column.cell_attack.hover_background_color = Constants.red;
					break;
				case 20:
					primary_table_column.cell_attack.background_color = Constants.green;
					primary_table_column.cell_attack.hover_background_color = Constants.green;
					break;
				default:
					primary_table_column.cell_attack.background_color = Constants.grey;
					primary_table_column.cell_attack.hover_background_color = Constants.grey;
			}
		}
	}

	_populate_ui_cell_damage(minion, primary_table_column) {
		primary_table_column.cell_damage.value = minion.damage;
		primary_table_column.cell_damage.background_color = minion.damage_contribute_to_total ? Constants.green : Constants.grey;
		primary_table_column.cell_damage.hover_background_color = minion.damage_contribute_to_total ? Constants.light_green : Constants.light_grey;
	}

	_populate_ui_cell_ammunition(minion, primary_table_column) {
		primary_table_column.cell_ammunition.value = minion.selected_weapon.current_ammunition;
		primary_table_column.cell_ammunition.max = minion.selected_weapon.max_ammunition;
		primary_table_column.cell_ammunition.min = 0;
		primary_table_column.cell_ammunition.disabled = false;
		if (minion.selected_weapon.max_ammunition === 0) {
			primary_table_column.cell_ammunition.disabled = true;
			primary_table_column.cell_ammunition.background_color = Constants.dark_grey;
			primary_table_column.cell_ammunition.hover_background_color = Constants.dark_grey;
		} else if (minion.selected_weapon.current_ammunition >= minion.selected_weapon.max_ammunition) {
			primary_table_column.cell_ammunition.background_color = Constants.green;
			primary_table_column.cell_ammunition.hover_background_color = Constants.light_green;
		} else if (minion.selected_weapon.current_ammunition <= 0) {
			primary_table_column.cell_ammunition.background_color = Constants.red;
			primary_table_column.cell_ammunition.hover_background_color = Constants.light_red;
		} else {
			primary_table_column.cell_ammunition.background_color = Constants.grey;
			primary_table_column.cell_ammunition.hover_background_color = Constants.light_grey;
		}
		
	}

	_populate_ui_cell_attack_advantage(minion, primary_table_column) {
		let ui_results = Constants.switch_on_roll_type(minion.attack_roll_type, 
			{value: 'nml', background_color: Constants.grey, hover_background_color: Constants.light_grey}, 
			{value: 'adv', background_color: Constants.green, hover_background_color: Constants.light_green},
			{value: 'dis', background_color: Constants.red, hover_background_color: Constants.light_red});
		primary_table_column.cell_attack_advantage.value = ui_results.value;
		primary_table_column.cell_attack_advantage.background_color = ui_results.background_color;
		primary_table_column.cell_attack_advantage.hover_background_color = ui_results.hover_background_color;
	}

	_populate_ui_cell_check_advantage(minion, primary_table_column) {
		let ui_results = Constants.switch_on_roll_type(minion.check_roll_type, 
			{value: 'nml', background_color: Constants.grey, hover_background_color: Constants.light_grey}, 
			{value: 'adv', background_color: Constants.green, hover_background_color: Constants.light_green},
			{value: 'dis', background_color: Constants.red, hover_background_color: Constants.light_red});
		primary_table_column.cell_check_advantage.value = ui_results.value;
		primary_table_column.cell_check_advantage.background_color = ui_results.background_color;
		primary_table_column.cell_check_advantage.hover_background_color = ui_results.hover_background_color;
	}

	_populate_ui_cell_weapon(minion, primary_table_column) {
		primary_table_column.cell_weapon.value = {};
		primary_table_column.cell_weapon.value.selected_option = minion.selected_weapon.nickname;
		primary_table_column.cell_weapon.value.options = minion.weapons.map(weapon => weapon.nickname);
	}

	/* --- update_state_from_table helpers --- */

	_populate_minion_values_from_ui(minion, primary_table_column) {
		minion.hit_points = primary_table_column.cell_hit_points.value == undefined ? minion.hit_points : primary_table_column.cell_hit_points.value;
		minion.attack_roll_type = this._get_roll_type_from_click_state(primary_table_column.cell_attack_advantage.click_state);
		minion.check_roll_type = this._get_roll_type_from_click_state(primary_table_column.cell_check_advantage.click_state);
		minion.damage_contribute_to_total = primary_table_column.cell_damage.click_state % 2 == 0;
		minion.selected_weapon.current_ammunition = primary_table_column.cell_ammunition.value == undefined || isNaN(primary_table_column.cell_ammunition.value) ? minion.selected_weapon.current_ammunition : primary_table_column.cell_ammunition.value;
		let selected_weapon = minion.weapons.filter( weapon => weapon.nickname == primary_table_column.cell_weapon.value.selected_option );
		minion.selected_weapon = selected_weapon.length == 0 ? minion.weapons[0] : selected_weapon[0];
	}

	_update_reroll_on_minion(minion, primary_table_column, table) {
		minion.should_reroll_attack = this._check_for_attack_reroll_on_minion(primary_table_column, table);
		minion.should_reroll_damage = this._check_for_damage_reroll_on_minion(primary_table_column, table);
		minion.should_reroll_check = this._check_for_check_reroll_on_minion(table);
	}

	_check_for_attack_reroll_on_minion(primary_table_column, table) {
		return table.begin_column['cell_attack'].updated || primary_table_column.cell_weapon.updated;
	}

	_check_for_damage_reroll_on_minion(primary_table_column, table) {
		return table.begin_column['cell_damage'].updated || primary_table_column.cell_weapon.updated;
	}

	_check_for_check_reroll_on_minion(table) {
		return table.begin_column['cell_check'].updated;
	}


	_get_roll_type_from_click_state(click_state) {
		switch(click_state % 3) {
			case 1:
				return 'Advantage';
			case 2:
				return 'Disadvantage';
			case 0:
			default:
				return 'Normal';
		}
	}
}