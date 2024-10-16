<template>
	<div class="payment-form-container">
		<div class="payment-form-card">
		<button class="close-button" @click="closeForm">&times;</button>
		<h1>Pago</h1>
		<form @submit.prevent="loadOpenPayScripts" id="payment-form">
			<div class="form-group">
				<label for="holder-name">Nombre del titular</label>
				<input 
				v-model="formData.holderName" 
				type="text" 
				id="holder-name" 
				placeholder="Como aparece en la tarjeta" 
				required
				/>
			</div>
			<div class="form-group">
				<label for="card-number">Número de tarjeta</label>
				<input 
				v-model="formData.cardNumber" 
				type="text" 
				id="card-number" 
				placeholder="1234 5678 9012 3456" 
				required
				/>
			</div>
			<div class="form-row">
				<div class="form-group">
				<label for="expiration-month">Mes</label>
				<input 
					v-model="formData.expMonth" 
					type="text" 
					id="expiration-month" 
					placeholder="MM" 
					required
				/>
				</div>
				<div class="form-group">
				<label for="expiration-year">Año</label>
				<input 
					v-model="formData.expYear" 
					type="text" 
					id="expiration-year" 
					placeholder="YYYY" 
					required
				/>
				</div>
				<div class="form-group">
				<label for="cvv">CVV</label>
				<input 
					v-model="formData.cvv" 
					type="text" 
					id="cvv" 
					placeholder="123" 
					required
				/>
				</div>
			</div>
			<v-btn
				type="submit"
				class="pay-button"
				:loading="isLoading"
				:disabled="isLoading"
				color="primary"
				>
				<span v-if="isLoading">Cargando...</span>
				<span v-else>Pagar</span>
			</v-btn>
		</form>
		<div class="payment-info">
			<p>Transacciones realizadas vía: <strong>OpenPay</strong></p>
			<p class="security-info">Tus pagos se realizan de forma segura con encriptación de 256 bits</p>
		</div>
		</div>
	</div>
  </template>
  
  <script>
  function data() {
	return {
		deviceSessionId: '',
		formData: {
			holderName: '',
			cardNumber: '',
			expMonth: '',
			expYear: '',
			cvv: '',
		},
	};
  }
  
export default {
	name: 'open-pay-form',
	data,
	created() {
		this.loadOpenPayScripts();
	},
	props: {
		response: Object,
		isLoading: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		loadOpenPayScripts() {
			const openpayScript = document.createElement('script');
			openpayScript.src = 'https://js.openpay.pe/openpay.v1.min.js';
			openpayScript.async = true;

			openpayScript.onload = () => {
				window.OpenPay.setId(this.response.payboxMerchantId);
				window.OpenPay.setApiKey(this.response.payboxClientAppKey);
				window.OpenPay.setSandboxMode(!this.response.payboxProduction);

				const openpayDataScript = document.createElement('script');
				openpayDataScript.src = 'https://js.openpay.pe/openpay-data.v1.min.js';
				openpayDataScript.async = true;

				openpayDataScript.onload = () => {
					this.setupDeviceData();
				};

				document.head.appendChild(openpayDataScript);
			};

			document.head.appendChild(openpayScript);
		},
		setupDeviceData() {
			this.isLoading = true;
			try {
				const deviceDataId = window.OpenPay.deviceData.setup('payment-form');
				this.deviceSessionId = deviceDataId;
				this.handlePayment();
			} catch (error) {
				console.error('Error:', error);
			}
		},
		closeForm() {
			this.$emit('close');
		},
		handlePayment() {
			const { holderName, cardNumber, expMonth, expYear, cvv } = this.formData;
			const cardData = {
				holder_name: holderName,
				card_number: cardNumber,
				expiration_month: expMonth,
				expiration_year: expYear,
				cvv2: cvv,
				device_session_id: this.deviceSessionId,
			};
			window.OpenPay.token.create(cardData, this.successCallback, this.errorCallback);
		},
		successCallback(response) {
			const token = response.data.id;
			this.$emit('save-payment', token, this.deviceSessionId);
		},
		errorCallback(error) {
			console.error('Error al generar el token:', error);
		},
	},
};
</script>
  
<style scoped>
.payment-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background-color: #f0f0f0;
  padding: 20px;
}

.payment-form-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 10px;
}

.pay-button {
  width: 95%;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.pay-button:hover {
  background-color: #3a7bb5; /* Color más oscuro al pasar el ratón */
}

.pay-button:disabled {
  background-color: #c0c0c0; /* Color para el botón deshabilitado */
  cursor: not-allowed; /* Cursor de no permitido */
}

.payment-info {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.security-info {
  font-size: 12px;
  color: #666;
}

@media (max-width: 480px) {
  .form-row {
	flex-direction: column;
  }
}
</style>