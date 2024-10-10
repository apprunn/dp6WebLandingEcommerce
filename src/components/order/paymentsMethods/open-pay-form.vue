<template>
    <div class="payment-form-container">
      <div class="payment-form-card">
        <button class="close-button" @click="closeForm">&times;</button>
        <h1>Pago con tarjeta</h1>
        <form>
          <div class="form-group">
            <label for="holder-name">Nombre del titular</label>
            <input type="text" id="holder-name" placeholder="Como aparece en la tarjeta">
          </div>
          <div class="form-group">
            <label for="card-number">Número de tarjeta</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="expiration-month">Mes</label>
              <input type="text" id="expiration-month" placeholder="MM">
            </div>
            <div class="form-group">
              <label for="expiration-year">Año</label>
              <input type="text" id="expiration-year" placeholder="YYYY">
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" placeholder="123">
            </div>
          </div>
          <button type="submit" class="pay-button">Pagar</button>
        </form>
        <div class="payment-info">
          <p>Transacciones realizadas vía: <strong>OpenPay</strong></p>
          <p class="security-info">Tus pagos se realizan de forma segura con encriptación de 256 bits</p>
        </div>
      </div>
    </div>
</template>
<script>
export default {
    name: 'open-pay-form',
    methods: {
        closeForm() {
            console.log('Close button clicked');
            this.$emit('close');
        },
    }
}
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
  width: 100%;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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