package com.manufacturing.planner;

import io.quarkus.runtime.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.h2.tools.Server;
import org.jboss.logging.Logger;
import java.sql.SQLException;

@ApplicationScoped
public class H2ServerManager {
  private static final Logger LOG = Logger.getLogger(H2ServerManager.class);
  private Server webServer;

  void onStart(@Observes StartupEvent ev) {
    try {
      LOG.info("Iniciando Console H2...");
      webServer = Server.createWebServer("-webAllowOthers", "-webPort", "8082").start();
      LOG.infof("H2 Console disponível em: %s", webServer.getURL());
    } catch (SQLException e) {
      LOG.error("ERRO AO INICIAR H2: Porta 8082 provavelmente em uso.");
    }
  }

  void onStop(@Observes ShutdownEvent ev) {
    if (webServer != null) {
      webServer.stop();
      LOG.info("Console H2 parado.");
    }
  }
}