package com.helio.comandas_api;

import com.helio.comandas_api.model.Comanda;
import com.helio.comandas_api.model.ItemComanda;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ComandaTest {

    @Test
    void deveSomarPrecoDosItensCorretamente() {
        Comanda comanda = new Comanda("Pedro");
        ItemComanda item1 = new ItemComanda("Pizza", 10);
        ItemComanda item2 = new ItemComanda("Refrigerante", 5);

        comanda.adicionarItem(item1);
        comanda.adicionarItem(item2);

        assertEquals(15, comanda.getValorTotal(), "O valor total deveria ser 15.0");
        assertEquals(2, comanda.getItens().size(), "A lista deveria ter 2 itens");
    }
}
