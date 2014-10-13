import org.testng.*;
import org.openqa.selenium.*;
public class pruebaaa{
WebDriver driver;
WebDriverWait wai;

@Test
public void pruebaaa_test(){
driver = new FirefoxDriver();
wait = new WebDriverWait(driver,15);
driver.get("");
wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[text()='dfd']")));
driver.findElement(By.xpath("//*[text()='dfd']")).click();
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("df")));
driver.findElement(By.id("df")).sendKeys("f");
try{
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("dff")));
wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("dfdfd")));
}catch(Exception e){
Assert.fail(" MENSAJE DE ERROR " + e.getMessage());
}
}

@AfterClass
public void closeDriver(){
driver.close();}
}