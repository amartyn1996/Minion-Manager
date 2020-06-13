import * as Constants from './Constants.js';

export default class Table {
	constructor() {
		this.begin_column = [];
		this.center_columns = [];
		this.end_column = [];
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

	get_state() {
		return { 
			begin_column: this._column_to_dto(this.begin_column),
			columns: this.center_columns.map(this._column_to_dto), 
			end_column: this._column_to_dto(this.end_column),
			table_configuration: this.table_configuration
		};
	}

	get_ui_configuration() {
		throw 'get_ui_configuration() is not implemented';
	}

	syncronize_fields(updated_state_dto) {
		throw 'syncronize_fields() is not implemented';
	}

	reset_center_columns(number_of_columns_to_create) {
		throw 'reset_center_columns() is not implemented'
	}

	_column_to_dto(column) {
		let dto = {};
		for (let key in column) {
			if (key.startsWith('cell_')) {
				dto[key] = column[key];
				dto[key].updated = false;
			}
		}
		return dto;
	}
}