<template>
	<div class="yape-main-container">
			<button
				type="button"
				class="yape-btn"
				:style="`border:1px solid ${globalColors.base}`"
				@click="show = !show"
			>
				<span class="yape-btn-content">Pague con: </span>
				<img
					src="https://lh3.googleusercontent.com/y5S3ZIz-ohg3FirlISnk3ca2yQ6cd825OpA0YK9qklc5W8MLSe0NEIEqoV-pZDvO0A8=s180-rw"
					alt="logo_yape"
				>
			</button>
			<div class="yape-modal-container">
				<div class="modal-qr">
					<img :src="urlImage" alt="yape_qr">
				</div>
			</div>
		
	</div>
</div>
</template>
<script>
import appInput from '@/components/shared/inputs/app-input';

function data() {
	return {
		phone: '',
		show: false,
		successTransaction: false,
	};
}
export default {
	name: 'yape-component',
	components: {
		appInput,
	},
	data,
	props: {
		urlImage: {
			required: true,
			type: String,
		},
	},
};
</script>
<style lang="scss" scoped>
.yape-btn {
	align-items: center;
	background-color: white;
	border-radius: 12px;
	display: flex;
	justify-content: space-between;
	padding: 10px 20px;
	transition: background-color, color 150ms ease-in-out;
	width: 180px;

	.yape-btn-content {
		font-family: font(bold);
		font-size: size(large);
	}

	img {
		border-radius: 50%;
		height: 45px;
		width: 45px;
	}

	&:hover {
		background-color: #7D349B;
		color: white;
	}
}

.yape-modal-container {
	align-items: center;
	background-color: white;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	font-family: font(regular);
	padding: 30px;

	.modal-close {
		align-items: center;
		color: #7D349B;
		display: flex;
		font-family: font(bold);
		justify-content: flex-end;
		width: 100%;

		button {
			font-size: 30px;
			height: 30px;
			width: 30px;
		}
	}

	.modal-header {
		align-items: center;
		display: flex;
		justify-content: space-between;

		img {
			border-radius: 50%;
			height: 65px;
			width: 65px;
		}
	}

	.modal-amount {
		align-items: center;
		display: flex;
		flex-direction: column;

		.amount-title {
			font-size: size(large);
		}

		.amount {
			font-family: font(bold);
			font-size: size(sbig);
		}
	}

	.modal-success {
		align-items: center;
		display: flex;
		flex-direction: column;
		height: 160px;
		margin: 41px auto 20px;
		width: 130px;

		.success-icon {
			border: 5px solid color(success);
			border-radius: 50%;
			color: color(success);
			padding: 15px;
			height: 130px;
			width: 130px;
		}

		h3 {
			color: color(success);
			font-family: font(bold);
			font-size: size(sbig);
		}

	}

	.thanks {
		text-align: center;
		max-width: 325px;
	}

	.modal-qr {
		align-items: center;
		border: 2px solid #7D349B;
		border-radius: 28px;
		display: flex;
		height: 230px;
		justify-content: center;
		margin: 25px auto;
		padding: 20px;
		width: 220px;

		img {
			height: 100%;
			width: 100%;
		}
	}

	.modal-send {
		align-items: flex-start;
		display: flex;
		height: 46px;

		.phone-number {
			width: 100%;

			.app-input {
				height: inherit;
			}
		}

		button {
			border-radius: 4px;
			color: white;
			height: inherit;
			width: 108px;
		}

		button:disabled {
			cursor: not-allowed;
			opacity: 0.25;
		}
	}
}

.validate-text {
	color: color(error);
}

.bold {
	font-family: font(bold);
}
.yape-main-container {
	align-items: flex-start;
	display: flex;
	justify-content: space-evenly;
	margin-top: 3rem;
}
</style>
