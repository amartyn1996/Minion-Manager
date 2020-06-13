<template>
	<div v-if="Object.keys(ui_state).length > 0">
		<table  
			:cellpadding="ui_state.table_configuration.cell_padding"
			:cellspacing="ui_state.table_configuration.cell_spacing"
			v-bind:style="{
				'background-color': ui_state.table_configuration.table_color,
				'border': ui_state.table_configuration.table_border
			}">
			<tr v-for="(row_variable_name, row_index) in row_ordering">
				<td v-if="Object.keys(ui_state.begin_column).length > 0"
					v-bind:style="{
						'border-left': ui_state.begin_column[ row_variable_name ] == undefined ? 'none' : ui_state.begin_column[ row_variable_name ].value.border_left,
						'border-right': ui_state.begin_column[ row_variable_name ] == undefined ? 'none' : ui_state.begin_column[ row_variable_name ].value.border_right,
						'border-top': ui_state.begin_column[ row_variable_name ] == undefined ? 'none' : ui_state.begin_column[ row_variable_name ].value.border_top,
						'border-bottom': ui_state.begin_column[ row_variable_name ] == undefined ? 'none' : ui_state.begin_column[ row_variable_name ].value.border_bottom
					}">
					<component-cell 
						:cell_width="ui_state.table_configuration.begin_cell_width"
						:cell_height="ui_state.table_configuration.cell_height"
						cell_type="default"
						:value="ui_state.begin_column[ row_variable_name ]"
						:default_background_color="ui_state.table_configuration.default_background_color"
						:default_text_color="ui_state.table_configuration.default_text_color"
						@input="update_model()">
					</component-cell>
				</td>
				<td v-for="(column, column_index) in ui_state.columns"
					v-bind:style="{
						'border-left': column[ row_variable_name ] == undefined ? 'none' : column[ row_variable_name ].value.border_left,
						'border-right': column[ row_variable_name ] == undefined ? 'none' : column[ row_variable_name ].value.border_right,
						'border-top': column[ row_variable_name ] == undefined ? 'none' : column[ row_variable_name ].value.border_top,
						'border-bottom': column[ row_variable_name ] == undefined ? 'none' : column[ row_variable_name ].value.border_bottom
					}">
					<component-cell 
						:cell_width="ui_state.table_configuration.column_cell_width"
						:cell_height="ui_state.table_configuration.cell_height"
						:cell_type="column[ row_variable_name ] == undefined ? 'default' : column[ row_variable_name ].cell_type"
						:value="column[ row_variable_name ]"
						:default_background_color="ui_state.table_configuration.default_background_color"
						:default_text_color="ui_state.table_configuration.default_text_color"
						@input="update_model()">
					</component-cell>
				</td>
				<td v-if="Object.keys(ui_state.end_column).length > 0"
					v-bind:style="{
						'border-left': ui_state.end_column[ row_variable_name ] == undefined ? 'none' : ui_state.end_column[ row_variable_name ].value.border_left,
						'border-right': ui_state.end_column[ row_variable_name ] == undefined ? 'none' : ui_state.end_column[ row_variable_name ].value.border_right,
						'border-top': ui_state.end_column[ row_variable_name ] == undefined ? 'none' : ui_state.end_column[ row_variable_name ].value.border_top,
						'border-bottom': ui_state.end_column[ row_variable_name ] == undefined ? 'none' : ui_state.end_column[ row_variable_name ].value.border_bottom
					}">
					<component-cell 
						:cell_width="ui_state.table_configuration.end_cell_width"
						:cell_height="ui_state.table_configuration.cell_height"
						cell_type="default"
						:value="ui_state.end_column[ row_variable_name ]"
						:default_background_color="ui_state.table_configuration.default_background_color"
						:default_text_color="ui_state.table_configuration.default_text_color"
						@input="update_model()">
					</component-cell>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
	import Cell from '@/components/cells/Cell';
	import DataFactory from '@/utils/DataFactory.js'

	export default {
		components: {
			'component-cell': Cell
		},
		data() {
			return {
				ui_state: {},
				row_ordering: [],
				convert_dto_to_ui_object_function: null,
				convert_ui_object_to_dto_function: null,
				debounced_update_function: null,
				debounce_time: 0
			}
		},
		mounted() {
			this.debounced_update_function = this.debounce( this.update_function, this.debounce_time );
			this.debounced_update_function();
		},
		watch: {
			debounce_time: function() {
				this.debounced_update_function = this.debounce( this.update_function, this.debounce_time );
			}
		},
		computed: {

		},
		methods: {
			initialize(column_cell_variables) {
				let business_to_ui_interface = DataFactory.build_MMTable_api(column_cell_variables);
				this.convert_dto_to_ui_object_function = business_to_ui_interface.convert_dto_to_ui_object;
				this.convert_ui_object_to_dto_function = business_to_ui_interface.convert_ui_object_to_dto;
				this.row_ordering = business_to_ui_interface.row_ordering;
				this.is_initialized = true;
			},
			update_ui(state_dto) {
				this.ui_state = this.convert_dto_to_ui_object_function(state_dto);
			},
			debounce(func, wait, immediate) {
				var timeout;
				return function() {
					var context = this, args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate) func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			},
			update_model() {
				this.debounced_update_function();
			},
			update_function() {
				this.$emit('update', this.convert_ui_object_to_dto_function(this.ui_state));
			}
		}
	}
</script>

<style type="text/css">
	
</style>