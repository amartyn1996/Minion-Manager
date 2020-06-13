<template>
	<div 
		class="cell-style" 
		v-bind:style="{
			'background-color': background_color, 
			'color': text_color,
			'cursor': cursor_type,
			'height': cell_height,
			'width': cell_width}" 
	>
		<span style="display: block; overflow: hidden;">
			<select 
				style="border: none; text-align: center;"
				v-bind:style="{
					'height': cell_height, 
					'width': cell_width, 
					'background-color': background_color, 
					'color': text_color
				}"
				ref="selectRef"
				:value="value.value != null ? value.value.value.selected_option : 'null'"
				@input="update_model">
				<option v-for="(option, option_index) in value.value.value.options"
					:key="option_index"
					v-bind:value="option">
					{{option}}
				</option>
			</select>
		</span>
	</div>
</template>

<script>
	export default {
		props: {
			is_hover: Boolean,
			cell_type: String,
			value: Object,
			cell_width: String,
			cell_height: String,
			background_color: String,
			text_color: String
		},
		data() {
			return {
				cursor_type: 'default'
			}
		},
		mounted() {

		},
		watch: {

		},
		computed: {
		},
		methods: {
			update_model() {
				this.value.value.value.selected_option = this.$refs.selectRef.value;
				this.$emit('input');
			}
		}
	}
</script>

<style scoped>
	.cell-style {

	}
</style>