package com.helio.comandas_api.model;

import com.google.cloud.firestore.annotation.ServerTimestamp;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor // necessário para Firebase ler o banco
public class Comanda {

    private String id;
    private String nomeCliente;
    private double valorTotal;
    private boolean aberta;

    @ServerTimestamp // aguarda resposta do servidor
    private Date dataCriacao;

    // mesmo que o Firebase use o construtor vazio, nunca será null
    private List<ItemComanda> itens = new ArrayList<>();

    public Comanda (String nomeCliente){
        this.nomeCliente = nomeCliente;
        this.dataCriacao = new Date();
        this.aberta = true;
        this.valorTotal = 0.0;
    }

    public void adicionarItem (ItemComanda item){
        if (item != null){
            this.itens.add(item);
            this.valorTotal += item.getPreco();
        }
    }
}
