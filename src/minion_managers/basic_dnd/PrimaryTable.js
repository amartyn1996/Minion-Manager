import Table from './Table.js';
import * as Constants from './Constants.js';

export default class PrimaryTable extends Table {
	constructor(number_of_columns) {
		super();
		this.begin_column = this._create_default_begin_column();
		this.center_columns = this._create_default_center_columns(number_of_columns);
		this.end_column = this._create_default_end_column();
		this.table_configuration = {
			table_color: Constants.dark_green,
			table_border: '1px solid black',
			default_background_color: Constants.dark_grey,
			default_text_color: Constants.white,
			begin_cell_width: '200px',
			column_cell_width: '100px',
			end_cell_width: '70px',
			cell_height: '30px',
			cell_padding: '0',
			cell_spacing: '0'
		};
	}

	get_ui_configuration() {
		let config = [ 
			{ name: 'cell_name', cell_type: 'default' },
			{ name: 'cell_hit_points', cell_type: 'input', input_type: 'number' },
			{ name: 'cell_attack', cell_type: 'default' },
			{ name: 'cell_damage', cell_type: 'default' },
			{ name: 'cell_ammunition', cell_type: 'input', input_type: 'number' },
			{ name: 'cell_attack_advantage', cell_type: 'default' },
			{ name: 'cell_weapon', cell_type: 'select' },
			{ name: 'cell_check_advantage', cell_type: 'default' },
			{ name: 'cell_check', cell_type: 'default' }
		];
		for (let check in Constants.checks) {
			let name = 'cell_' + Constants.convert_check_to_variable_name(check);
			config.push({ name: name, cell_type: 'default' });
		}
		return config;
	}

	reset_center_columns(number_of_columns_to_create) {
		this.center_columns = this._create_default_center_columns(number_of_columns_to_create);
	}

	syncronize_fields(updated_state_dto) {
		this._syncronize_fields(updated_state_dto.begin_column, this.begin_column);
		this._syncronize_columns(updated_state_dto.columns);
		this._syncronize_fields(updated_state_dto.end_column, this.end_column);
	}

	_syncronize_columns(column_dtos) {
		if (column_dtos.length != this.center_columns.length) {
			throw 'Columns are not the same length';
		}
		//Update with dto values
		for (let i = 0; i < column_dtos.length; i++) {
			this._syncronize_fields(column_dtos[i], this.center_columns[i]);
		}
	}

	_syncronize_fields(column_dto, old_column) {
		for (let key in column_dto) {
			old_column[key] = column_dto[key];
		}
	}

	_create_default_center_columns(number_of_columns) {
		let center_columns = [];
		for (let i = 0; i < number_of_columns; i++) {
			center_columns.push(this._create_default_center_column());
		}
		return center_columns;
	}

	_create_default_center_column() {
		let column = {};
		this.get_ui_configuration().forEach(row_config => {
			column[row_config.name] = {};
		});

		this._populate_column_with_default_values(column);
		this._make_cell_toggleable(column.cell_damage);
		this._make_cell_toggleable(column.cell_attack_advantage);
		this._make_cell_toggleable(column.cell_check_advantage);
		return column;
	}

	_make_cell_toggleable(cell) {
		cell.cursor_type = 'pointer';
		cell.is_toggleable = true;
		cell.hover_background_color = Constants.light_grey;
	}

	_create_default_end_column() {
		let column = {};
		column.cell_damage = {};
		this._populate_column_with_default_values(column);
		return column;
	}

	_create_default_begin_column() {
		let column = {};
		column.cell_name = { value: 'Name' };
		column.cell_hit_points = { value: 'Hit Points' };
		column.cell_attack = { value: 'Attack' };
		column.cell_damage = { value: 'Damage' };
		column.cell_ammunition = { value: 'Ammunition' };
		column.cell_attack_advantage = { value: 'Attack (Dis)Advantage' };
		column.cell_weapon = { value: 'Weapon' };
		column.cell_check_advantage = { value: 'Check (Dis)Advantage' };
		column.cell_check = { value: 'Check Roll' };
		for (let check in Constants.checks) {
			let name = 'cell_' + Constants.convert_check_to_variable_name(check);
			column[name] = { value: check }
		}
		this._populate_column_with_default_values(column);
		this._make_cell_toggleable(column.cell_damage);
		this._make_cell_toggleable(column.cell_attack);
		this._make_cell_toggleable(column.cell_check);
		return column;
	}

	_populate_column_with_default_values(column) {
		for(let key in column) {
			column[key].updated = true;
			column[key].click_state = 0;
			column[key].background_color = Constants.grey;
			column[key].text_color = Constants.white;
			column[key].border_left = 'none';
			column[key].border_right = '1px solid black';
			column[key].border_top = 'none';
			column[key].border_bottom = 'none';
		}
	}
}