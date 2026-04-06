package com.helio.comandas_api.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor  // para o Firebase (Obrigatório)
@AllArgsConstructor // para Dev
public class ItemComanda {

    @NotBlank(message = "O nome do item é obrigatório")
    private String nome;
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero")
    private double preco;

}