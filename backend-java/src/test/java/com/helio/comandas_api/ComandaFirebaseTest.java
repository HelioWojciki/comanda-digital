package com.helio.comandas_api;

import com.helio.comandas_api.model.Comanda;
import com.helio.comandas_api.model.ItemComanda;
import com.helio.comandas_api.service.ComandaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class ComandaFirebaseTest {

    @Autowired
    private ComandaService comandaService;

    @Test
    void deveSalvarComandaComItemNoFirebase () throws Exception {
        Comanda comanda = new Comanda("Teste Integração");
        comanda.adicionarItem(new ItemComanda("Salgado", 9.99));
        comanda.adicionarItem(new ItemComanda("Suco", 4.99));

        String idGeradoNoRetornoDoFirebase = comandaService.salvar(comanda);

        assertNotNull(idGeradoNoRetornoDoFirebase, "O ID não deveria ser nulo se foi salvo no Firebase");
        System.out.println("Comanda salva com sucesso! ID: " + idGeradoNoRetornoDoFirebase);
    }
}
