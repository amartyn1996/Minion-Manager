<template>
	<div>
		<mm-table ref="top_table" @update="update('top_table', $event)"></mm-table>
		<mm-table ref="primary_table" @update="update('primary_table', $event)"></mm-table>
	</div>
</template>

<script>
	import MMTable from '@/components/MMTable';
	import MinionManager from '@/minion_managers/basic_dnd/MinionManager.js'

	export default {
		components: {
			'mm-table': MMTable
		},
		props: {

		},
		data() {
			return {
				minion_manager: null
			}
		},
		mounted() {
			this.minion_manager = new MinionManager();
			let table_names = ['top_table', 'primary_table'];
			for (let table_index in table_names) {
				let table_name = table_names[table_index];
				this.$refs[table_name].initialize( this.minion_manager.get_ui_configuration(table_name) );
				let state = this.minion_manager.get_table_state(table_name);
				this.$refs[table_name].update_ui(state);
			}
			this.minion_manager.set_update_ui_callback(this.update_from_state);
		},
		watch: {

		},
		computed: {

		},
		methods: {
			update(table_name, args) {
				this.$refs[table_name].update_ui( this.minion_manager.update(table_name, args) );
			},
			update_from_state(table_name, state) {
				this.$refs[table_name].update_ui(state);
			}
		}
	}
</script>

<style scoped>
	.cell-style {

	}
</style>