import * as Constants from './Constants.js';
import TopTable from './TopTable.js';
import PrimaryTable from './PrimaryTable.js';
import StateToTopTableInterface from './StateToTopTableInterface.js';
import StateToPrimaryTableInterface from './StateToPrimaryTableInterface.js';
import Minion from './Minion.js';
import DNDBasicState from './DNDBasicState.js';
import DNDBasicBusinessLogic from './DNDBasicBusinessLogic.js';

export default class DNDBasicRuleConfiguration {
	constructor() {
		this.tables = {
			top_table: new TopTable(1),
			primary_table: new PrimaryTable(Constants.default_number_of_central_columns)
		};
		this.table_interfaces = {
			top_table_interface: new StateToTopTableInterface(),
			primary_table_interface: new StateToPrimaryTableInterface()
		};
		this.table_to_interface_mapping = {
			top_table: 'top_table_interface',
			primary_table: 'primary_table_interface'
		};
		this.business_logic = new DNDBasicBusinessLogic();
		this.state = new DNDBasicState();
		for (let table_name in this.table_to_interface_mapping) {
			let table_interface = this.table_interfaces[this.table_to_interface_mapping[table_name]];
			table_interface.initilize_table_from_state( { state: this.state, table: this.tables[table_name] } );
		}
		this._run_business_logic();

		this.asynchronous_callbacks = {
			import_file: (file_contents) => this._import_file(file_contents)
		};
	}

	set_update_ui_callback(callback) {
		this.asynchronous_callbacks.update_ui = callback;
	}

	update(table_name, updated_state_dto) {
		let _this = this;
		if (this.tables[table_name] == undefined) {
			console.error('Could not update from table \'' + table_name + '\'');
			return;
		}
		let table = this.tables[table_name];
		table.syncronize_fields(updated_state_dto);
		this._run_business_logic();
		return this.get_table_state(table_name);
	}

	get_table_state(table_name) {
		if (this.tables[table_name] == undefined) {
			console.error('Could not get state for table \'' + table_name + '\'');
			return;
		}
		return this.tables[table_name].get_state();
	}

	get_ui_configuration(table_name) {
		if (this.tables[table_name] == undefined) {
			console.error('Could not get ui configuration for table \'' + table_name + '\'');
			return;
		}
		return this.tables[table_name].get_ui_configuration();
	}

	_run_business_logic() {
		for (let table_name in this.table_to_interface_mapping) {
			let table_interface = this.table_interfaces[this.table_to_interface_mapping[table_name]];
			table_interface.update_state_from_table({state: this.state, table: this.tables[table_name], asynchronous_callbacks: this.asynchronous_callbacks});
		}
		this.business_logic.update(this.state);
		for (let table_name in this.table_to_interface_mapping) {
			let table_interface = this.table_interfaces[this.table_to_interface_mapping[table_name]];
			table_interface.update_table_from_state({state: this.state, table: this.tables[table_name], asynchronous_callbacks: this.asynchronous_callbacks});
		}
	}

	_import_file(file_contents) {
		//TODO: refactor. this is temporary
		if (file_contents != undefined && file_contents !== '') {
			let state = JSON.parse(file_contents);
			this.state = state;

			this.business_logic.update(this.state);
			for (let table_name in this.table_to_interface_mapping) {
				let table_interface = this.table_interfaces[this.table_to_interface_mapping[table_name]];
				table_interface.update_table_from_state({state: this.state, table: this.tables[table_name], asynchronous_callbacks: this.asynchronous_callbacks});
				this.asynchronous_callbacks.update_ui(table_name, this.get_table_state(table_name));
			}
		}
	}
}