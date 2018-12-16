package com.hyt.server.config.core.swagger;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @Author: XincanJiang
 * @Description:
 * @Date: Created in 17:08 2018-4-23
 * @Modified By:
 */
@Configuration
@EnableSwagger2
public class Swagger2Config {

    @Bean
    public Docket ProductApi() {
        /*return new Docket(DocumentationType.SWAGGER_2)
                .genericModelSubstitutes(DeferredResult.class)
                .useDefaultResponseMessages(false)
                .forCodeGeneration(false)
                .pathMapping("/")
                .select()
                .build()
                .apiInfo(productApiInfo());*/

        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.hyt.server"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(productApiInfo());
    }

    private ApiInfo productApiInfo() {
        return new ApiInfoBuilder()
                .description("全国预警信息发布平台API")
                .license("xincan.1.0")
                .licenseUrl("https://github.com/xincan/xincan-api-ui-layer")
                .title("EWIP API")
                .description("开发人员内部文档")
                .termsOfServiceUrl("alittlexincan@163.com")
                .contact(new Contact("JiangxXincan", "https://github.com/xincan/xincan-api-ui-layer", "alittlexincan@163.com"))
                .version("1.0")
                .build();
    }
}