export default class StateToTableInterface {
	update_state_from_table(args) {
		this._throw_not_implemented();
	}

	update_table_from_state(args) {
		this._throw_not_implemented();
	}

	initilize_table_from_state(args) {
		this._throw_not_implemented();
	}

	_throw_not_implemented() {
		throw 'This method is not implemented';
	}
}