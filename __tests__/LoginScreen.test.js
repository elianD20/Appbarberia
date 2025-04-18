// sum.test.js
const suma = require('../src/sum');

describe('Prueba de la función suma', () => {
  it('debería sumar dos números correctamente', () => {
    expect(suma(2, 3)).toBe(5); // Esperamos que la suma de 2 + 3 sea 5
  });

  it('debería retornar un número negativo cuando la suma de números negativos', () => {
    expect(suma(-2, -3)).toBe(-5); // Suma de números negativos
  });

  it('debería sumar números decimales correctamente', () => {
    expect(suma(2.5, 3.5)).toBe(6); // Suma de números decimales
  });
});
