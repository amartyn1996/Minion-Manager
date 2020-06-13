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
			<input 
				style="border: none; text-align: center;"
				v-bind:style="{
					'height': cell_height, 
					'width': cell_width, 
					'background-color': background_color, 
					'color': text_color,
					'-moz-appearance': (value.value.disabled == undefined ? 'none' : (value.value.disabled ? 'textfield' : 'none'))
				}"
				ref="inputRef"
				:type="value.input_type"
				:value="value.value != null ? value.value.value : 'null'"
				@input="update_model"
				:max="value.value.max == undefined ? Number.POSITIVE_INFINITY : value.value.max"
				:min="value.value.min == undefined ? Number.NEGATIVE_INFINITY : value.value.min"
				:disabled="value.value.disabled == undefined ? false : value.value.disabled"
				:accept="value.value.accept == undefined ? '' : value.value.accept">
			</input>
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
			update_model(event) {
				if (this.value.input_type === 'number') {
					this.value.value.value = isNaN(this.$refs.inputRef.value) ? NaN : Number(this.$refs.inputRef.value);
				} else if (this.value.input_type === 'file') {
					this.value.value.files = event.target.files;
				} else {
					this.value.value.value = this.$refs.inputRef.value;
				}
				this.$emit('input');
			}
		}
	}
</script>

<style scoped>
	.cell-style {

	}
</style>