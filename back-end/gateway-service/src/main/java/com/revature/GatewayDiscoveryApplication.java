package com.revature;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

// This way, gateway doesn't have to rely on Eureka
@EnableZuulProxy
@EnableDiscoveryClient
@SpringBootApplication
public class GatewayDiscoveryApplication {
	public static void main(String[] args) {
		SpringApplication.run(GatewayDiscoveryApplication.class, args);
	}
}