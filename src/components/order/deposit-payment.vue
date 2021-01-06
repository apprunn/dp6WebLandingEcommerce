<template>
	<div class="deposit-container">
		<div class="deposit-wrapper" v-if="stepFour">
			<h4 class="deposit-title">¡Gracias por comprar en {{getCommerceData.name}}!</h4>
			<p
				v-if="isDeposit"
				class="deposit-content"
			>Tienes hasta 24 horas para efectuar el pago en cualquiera de nuestros bancos afiliados con tu número de pedido.</p>
		</div>

		<div class="deposit-wrapper" v-else>
			<online-deposits class="mb-4" :deposits="filtered"/>
			<h2 v-if="thereAreNoBanksAccounts">No existen cuentas bancarias configuradas</h2>
			<div v-else>
				<v-radio-group  v-model="selectedBank" row class="mt-4">
					<v-radio
						:color="`${globalColors.primary}`"
						:label="bank.bank.name" 
						:value="bank.bankId"
						v-for="bank in getBankAccounts"
						class="my-2"
						:key="bank.id">
					</v-radio>
				</v-radio-group>
			</div>
			<div v-if="!thereAreNoBanksAccounts">
				<ul class="mb-1">
					<li
						v-for="account in bankAccounts"
						:key="account.id"
						class="mb-4"
					>
						<div class="bank-account-number">
							<h4
								class="bank-account-info font-bold"
							>{{account.name}}: </h4>
							<h3>{{account.accountNumber}}</h3>
						</div>
						<div class="person-name-info">
							<h4>A Nombre de: <span>
								{{account.additionalInformation && account.additionalInformation.personName}}
							</span></h4>
							<h4>Documento de identidad: <span>
								{{account.additionalInformation && account.additionalInformation.personDocumentNumber}}
							</span></h4>
							<h4>Correo: <span>
								{{account.additionalInformation && account.additionalInformation.documentEmail}}
							</span></h4>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { deposit } from '@/shared/enums/wayPayment';
import onlineDeposits from '@/components/order/deposit-payments';
import { getDeeper } from '@/shared/lib';


function created() {
	if (this.getBankAccounts.length) {
		this.selectedBank = this.getBankAccounts[0].bankId;
	}
	this.getDeposits();
}

function getDeposits() {
	const { id } = this.getCommerceData.wayPayment.find(g => g.code === deposit.code);
	const { gatewayConfiguration } = this.getWaypaymentsByCommerce.find(
		g => g.wayPaymentId === id,
	);
	this.filtered = gatewayConfiguration;
}

function stepFour() {
	return this.$route.meta.step === 4;
}

function selectedBank(value) {
	this.$store.commit('SET_BANK_ACCOUNT', value);
}

function bankAccounts() {
	const index = this.getBankAccounts.findIndex(b => b.bankId === this.selectedBank);
	if (index > -1) {
		return this.getBankAccounts[index].accounts;
	}
	return this.getBankAccounts[0].accounts;
}

function thereAreNoBanksAccounts() {
	return this.getBankAccounts.length === 0;
}

function isDeposit() {
	const wayPaymentSelected = getDeeper('wayPayment.code')(this.getOrderInfo);
	return wayPaymentSelected === deposit.code;
}

function data() {
	return {
		filtered: [],
		selectedBank: null,
	};
}

export default {
	name: 'deposit-payment',
	components: {
		onlineDeposits,
	},
	created,
	computed: {
		...mapGetters([
			'getBankAccounts',
			'getCommerceData',
			'getWaypaymentsByCommerce',
			'getOrderInfo',
		]),
		bankAccounts,
		isDeposit,
		stepFour,
		thereAreNoBanksAccounts,
	},
	data,
	methods: {
		getDeposits,
	},
	watch: {
		selectedBank,
	},
};
</script>
<style lang="scss" scoped>
	.deposit-container {
		color: color(dark);
		font-family: font(medium);
		padding: 0 10px;

		@media (max-width: 768px) {
		}
	}

	.deposit-content {
		font-size: size(small);
	}

	.deposit-title {
		font-size: size(medium);
		margin: 30px 0 10px;
	}

	.deposit-bank {
		font-size: size(medium);
		font-family: font(bold);
	}

	.deposit-account-bank {
		color: color(dark);
		display:flex;
		flex-direction: column;
		font-family: font(demi);
		font-size: size(medium);
		margin-bottom: 0;
		white-space: nowrap;
	}

	.bank-account-container {
		background-color: color(white);
		border: solid 1px color(border);
		border-radius: 3px;
		padding: 25px 35px;
		text-align: center;

		@media (max-width: 600px) {
			margin: auto;
		}
	}

	.deposit-wrapper {
		max-width: 656px;

		@media (max-width: 768px) {
			width: auto;
		}

		@media (max-width: 600px) {
			margin: 0 auto 15px;
		}
	}

	.deposit-select-bank {
		align-items: center;
		display: flex;
		justify-content: flex-start;
	}

	.icon-bank-ecuador {
		height: 70px;
		width: 105px;
	}

	.font-bold {
		font-family: font(bold);
	}

	.bank-account-number {
		display: flex;
		flex-direction: column;
		font-size: size(large);
		margin-bottom: 10px;

		@media (min-width: 599px){
			align-items: center;
			flex-direction: row;
		}

		h3 {
			align-self: center;
			font-size: size(sbig);

			@media (min-width: 599px){
				margin-left: 20px;
			}
		}
	}

	.person-name-info {
		font-family: font(regular);

		h4 {
			margin: 7px 0;
		}

		span {
			font-family: font(bold);
			font-size: size(medium);
		}
	}
</style>
