import java.lang.invoke.*;

public class TestClass {

    private static final String CONSTANT_STRING = "Hello, World!";
    private static final int CONSTANT_INTEGER = 123;
    private static final float CONSTANT_FLOAT = 123.45f;
    private static final long CONSTANT_LONG = 123456789L;
    private static final double CONSTANT_DOUBLE = 123456789.012345;

    public static void main(String[] args) {
        System.out.println(CONSTANT_STRING);
        System.out.println(CONSTANT_INTEGER);
        System.out.println(CONSTANT_FLOAT);
        System.out.println(CONSTANT_LONG);
        System.out.println(CONSTANT_DOUBLE);
        printHello();
    }

    private static void printHello() {
        System.out.println("Hello from printHello method");
    }
}

interface TestInterface {
    void testMethod();
}

class TestInterfaceImpl implements TestInterface {
    public void testMethod() {
        System.out.println("Hello from testMethod in TestInterfaceImpl");
    }
}

class InvokeDynamicTest {
    private static final CallSite BootstrapMethod(MethodHandles.Lookup lookup, String name, MethodType mt) throws Throwable {
        return new ConstantCallSite(lookup.findStatic(InvokeDynamicTest.class, name, mt));
    }

    private static void testMethod() {
        System.out.println("Hello from invokedynamic");
    }

    public void testInvokeDynamic() throws Throwable {
        CallSite cs = BootstrapMethod(MethodHandles.lookup(), "testMethod", MethodType.methodType(void.class));
        MethodHandle mh = cs.dynamicInvoker();
        mh.invokeExact();
    }
}
