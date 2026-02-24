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
    killProcessOnPort(8082);
    try {
      LOG.info("Iniciando Console H2...");
      webServer = Server.createWebServer("-webAllowOthers", "-webPort", "8082").start();
      LOG.infof("H2 Console disponível em: %s", webServer.getURL());
    } catch (SQLException e) {
      LOG.error("ERRO AO INICIAR H2: " + e.getMessage());
    }
  }

  void onStop(@Observes ShutdownEvent ev) {
    if (webServer != null) {
      webServer.stop();
      LOG.info("Console H2 parado.");
    }
  }

  private void killProcessOnPort(int port) {
    try {
      String os = System.getProperty("os.name").toLowerCase();
      ProcessBuilder pb;

      if (os.contains("win")) {
        pb = new ProcessBuilder("cmd.exe", "/c",
            "for /f \"tokens=5\" %a in ('netstat -aon ^| find \":" + port + "\"') do taskkill /f /pid %a");
      } else {
        pb = new ProcessBuilder("sh", "-c",
            "fuser -k " + port + "/tcp 2>/dev/null || lsof -ti:" + port + " | xargs kill -9 2>/dev/null");
      }

      pb.inheritIO().start().waitFor();
      LOG.infof("Processos na porta %d encerrados.", port);
      Thread.sleep(500); // aguarda o SO liberar a porta
    } catch (Exception e) {
      LOG.warnf("Não foi possível encerrar processos na porta %d: %s", port, e.getMessage());
    }
  }
}