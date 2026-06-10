package com.tarot;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TarotApplication {
    public static void main(String[] args) {
        SpringApplication.run(TarotApplication.class, args);
    }

    @Bean
    public CommandLineRunner openBrowser() {
        return args -> {
            String port = System.getProperty("server.port", "8080");
            try {
                Thread.sleep(1500);
                String os = System.getProperty("os.name").toLowerCase();
                if (os.contains("win")) {
                    new ProcessBuilder("cmd", "/c", "start", "http://localhost:" + port).start();
                } else if (os.contains("mac")) {
                    new ProcessBuilder("open", "http://localhost:" + port).start();
                } else {
                    new ProcessBuilder("xdg-open", "http://localhost:" + port).start();
                }
            } catch (Exception e) {
                // 浏览器未能自动打开，用户可以手动打开
            }
        };
    }
}
