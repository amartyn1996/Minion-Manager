var DataFactory = {
	build_MMTable_api(configuration) {
		//Make deep copy of configuration. We don't want it to be modified.
		var configuration_copy = JSON.parse(JSON.stringify( configuration ));

		let names_set = {};
		//Check for duplicate names
		let check_duplicate_row_names = (row_configuration) => {
			let name = row_configuration.name;
			if (name == undefined) {
				console.log('Could not build row. Name is undefined');
			} else if (typeof(name) != 'string') {
				console.log('Could not build row. The name \'' + name + '\' is not a String');
			} else if (name.length == 0) {
				console.log('Could not build row. The name \'' + name + '\' is an empty string');
			} else if (names_set[name] != undefined) {
				console.log('Could not build row. The name \'' + name + '\' is a duplicate');
			} else {
				names_set[name] = name;
				return true;
			}
			return false;
		};
		configuration_copy = configuration_copy.filter(check_duplicate_row_names);
		let row_ordering = configuration_copy.map( row_configuration => row_configuration.name );

		let row_name_to_configuration_map = {}
		configuration_copy.forEach( row_configuration => {
			row_name_to_configuration_map[row_configuration.name] = row_configuration;
		});

		let convert_business_column_to_ui_column = ( business_column ) => {
			let ui_column = {};
			for (let key in business_column ) {
				if (row_name_to_configuration_map[key] === undefined) {
					console.log('Could not populate column. The variable \'' + key + '\' is not defined on the column');
				} else {
					ui_column[key] = {
						value: business_column[key]
					};
					for (let row_name_to_configuration_map_key in row_name_to_configuration_map[key] ) {
						if (row_name_to_configuration_map_key == 'name') {
							continue;
						} else {
							ui_column[key][row_name_to_configuration_map_key] = row_name_to_configuration_map[key][ row_name_to_configuration_map_key ];
						}
					}
				}
			}
			return ui_column;
		};

		let convert_ui_column_to_business_column = ( ui_column ) => {
			let business_column = {};
			for (let key in ui_column ) {
				business_column[key] = ui_column[key].value;
			}
			return business_column;
		};

		let convert_column_to_default = (ui_column) => {
			for (let key in this.end_column) {
				this.ui_column[key] = { value: this.ui_column[key].value, column_type: 'default' };
			}
		}

		let convert_dto_to_ui_object = (dto) => {
			let ui_object = {};
			ui_object.begin_column = convert_business_column_to_ui_column(dto.begin_column);
			ui_object.columns = dto.columns.map(convert_business_column_to_ui_column);
			ui_object.end_column = convert_business_column_to_ui_column(dto.end_column);
			ui_object.table_configuration = dto.table_configuration;
			return ui_object;
		};

		let convert_ui_object_to_dto = (ui_object) => {
			let dto = {};
			dto.begin_column = convert_ui_column_to_business_column(ui_object.begin_column);
			dto.columns = ui_object.columns.map(convert_ui_column_to_business_column);
			dto.end_column = convert_ui_column_to_business_column(ui_object.end_column);
			dto.table_configuration = ui_object.table_configuration;
			return dto;
		};

		return { 
			convert_dto_to_ui_object:  convert_dto_to_ui_object,
			convert_ui_object_to_dto: convert_ui_object_to_dto,
			row_ordering: row_ordering
		};
	}
};

export default DataFactory;