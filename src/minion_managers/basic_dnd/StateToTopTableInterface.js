import * as Constants from './Constants.js';
import PrimaryTable from './PrimaryTable.js';
import StateToTableInterface from './StateToTableInterface.js';

export default class StateToPrimaryTableInterface extends StateToTableInterface {
	update_state_from_table(args) {
		let state = args.state;
		let table = args.table;
		let center_columns = table.center_columns;
	}

	update_table_from_state(args) {
		let state = args.state;
		let table = args.table;
		let center_columns = table.center_columns;
		if (center_columns.length >= 1) {
			let file_list = center_columns[0].cell_import.files;
			if (file_list != undefined) {
				let file_array = Array.from(file_list);
				if (file_array.length > 0) {
					let read = new FileReader();
					read.readAsBinaryString(file_array[0]);
					read.onloadend = () => {return args.asynchronous_callbacks.import_file(read.result)};
				}
			}
			center_columns[0].cell_import.files = undefined;
		}
	}

	initilize_table_from_state(args) {
		//TODO: refactor. This is temporary
		let state = args.state;
		let table = args.table;
		let center_columns = table.center_columns
		let str = JSON.stringify(state, null, 4);
		let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);

		let rows = {
			cell_import: [
				{value: '', accept: '.json'}
			],
			cell_export: [
				{value: 'Export', href: dataUri, download: 'minion_manager_export.json'}
			]
		};
		for (let column_index in center_columns) {
			let column = center_columns[column_index];
			for (let column_row in column) {
				if (rows[column_row] != undefined) {
					let cell = column[column_row];
					let populator_cell = rows[column_row][column_index];
					for (let key in populator_cell) {
						cell[key] = populator_cell[key];
					}
				}
			}
		}
	}
}